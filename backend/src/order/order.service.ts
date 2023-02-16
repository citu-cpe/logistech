import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Company,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductItem,
  ProductItemStatus,
} from '@prisma/client';
import { CartDTO } from '../cart/dto/cart.dto';
import { CompanyService } from '../company/company.service';
import { PrismaService } from '../global/prisma/prisma.service';
import { OrderDTO, OrderStatusEnum } from './dto/order.dto';
import { OrderItemService } from './order-item.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createOrders(dto: CartDTO, companyId: string) {
    if (dto.groupedOrderItems.length === 0) {
      throw new BadRequestException('No orders to create');
    }

    const orders: (Omit<Order, 'id' | 'createdAt' | 'updatedAt'> & {
      orderItemIds: { id: string }[];
    })[] = [];

    for (const group of dto.groupedOrderItems) {
      orders.push({
        total: group.total,
        fromCompanyId: companyId,
        toCompanyId: group.company.id,
        status: OrderStatusEnum.PENDING,
        orderItemIds: group.orderItems.map((o) => ({ id: o.id })),
      });
    }

    for (const order of orders) {
      const actualOrder = { ...order, orderItemIds: undefined };
      const newOrder = await this.prismaService.order.create({
        data: {
          ...actualOrder,
          orderItems: {
            connect: order.orderItemIds,
          },
        },
      });

      await this.prismaService.cart.update({
        where: { id: dto.id },
        data: { orderItems: { disconnect: order.orderItemIds }, total: 0 },
      });

      const orderItems = await this.prismaService.orderItem.findMany({
        where: { id: { in: order.orderItemIds.map((o) => o.id) } },
      });

      const productItems: ProductItem[] = [];

      for (const orderItem of orderItems) {
        const foundProductItems = await this.prismaService.productItem.findMany(
          {
            where: {
              productId: orderItem.productId,
              status: ProductItemStatus.IN_STORAGE,
            },
            take: orderItem.quantity,
          }
        );

        productItems.push(...foundProductItems);

        if (foundProductItems.length < orderItem.quantity) {
          throw new BadRequestException('Not enough items in stock');
        }

        const orderProductItemIds = foundProductItems.map((p) => p.id);

        await this.prismaService.productItem.updateMany({
          where: { id: { in: orderProductItemIds } },
          data: {
            status: ProductItemStatus.ON_HOLD,
            orderItemId: orderItem.id,
          },
        });
      }

      const productItemIds = productItems.map((p) => p.id);

      await this.prismaService.transaction.create({
        data: {
          sendingCompanyId: newOrder.toCompanyId,
          receivingCompanyId: newOrder.fromCompanyId,
          productItems: {
            connect: productItemIds.map((id) => ({ id })),
          },
        },
      });
    }
  }

  public async getIncomingOrders(companyId: string) {
    const incomingOrders = await this.prismaService.order.findMany({
      where: { toCompanyId: companyId },
      include: {
        orderItems: { include: { product: true } },
        fromCompany: true,
      },
    });

    return incomingOrders.map((o) => OrderService.convertToDTO(o));
  }

  public async getOutgoingOrders(companyId: string) {
    const incomingOrders = await this.prismaService.order.findMany({
      where: { fromCompanyId: companyId },
      include: {
        orderItems: { include: { product: true } },
        toCompany: true,
      },
    });

    return incomingOrders.map((o) => OrderService.convertToDTO(o));
  }

  public async getOrderById(orderId: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true, productItems: true } },
        toCompany: true,
        fromCompany: true,
      },
    });

    return OrderService.convertToDTO(order);
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus) {
    await this.prismaService.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  public static convertToDTO(
    order: Order & {
      orderItems: (OrderItem & {
        product: Product;
        productItems?: ProductItem[];
      })[];
      toCompany?: Company;
      fromCompany?: Company;
    }
  ): OrderDTO {
    const toCompany =
      !!order.toCompany && CompanyService.convertToDTO(order.toCompany);
    const fromCompany =
      !!order.fromCompany && CompanyService.convertToDTO(order.fromCompany);
    return {
      ...order,
      orderItems: order.orderItems.map((o) => OrderItemService.convertToDTO(o)),
      status: order.status as OrderStatusEnum,
      toCompany,
      fromCompany,
    };
  }
}
