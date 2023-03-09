import { BadRequestException, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  Company,
  Order,
  OrderItem,
  OrderStatus,
  Payment,
  Product,
  ProductItem,
  ProductItemStatus,
  User,
  UserRole,
} from '@prisma/client';
import { CronJob, CronTime } from 'cron';
import { CartDTO } from '../cart/dto/cart.dto';
import { CompanyService } from '../company/company.service';
import { PrismaService } from '../global/prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { UserService } from '../user/user.service';
import { OrderDTO, OrderStatusEnum } from './dto/order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { OrderItemService } from './order-item.service';

const ORDER_DUE_DATE_PREFIX = 'DUE DATE: ';

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  public async createOrders(dto: CartDTO, companyId: string) {
    if (dto.groupedOrderItems.length === 0) {
      throw new BadRequestException('No orders to create');
    }

    const lastCreatedOrder: Order | null =
      await this.prismaService.order.findFirst({
        orderBy: { createdAt: 'desc' },
        take: 1,
      });

    const lastCreatedOrderInvoiceNumber = lastCreatedOrder?.invoiceNumber ?? 0;

    const orders: (Omit<
      Order,
      'id' | 'createdAt' | 'updatedAt' | 'finalized'
    > & {
      orderItemIds: { id: string }[];
    })[] = [];

    let i = 1;
    for (const group of dto.groupedOrderItems) {
      orders.push({
        total: group.total,
        fromCompanyId: companyId,
        toCompanyId: group.company.id,
        status: OrderStatusEnum.PENDING,
        orderItemIds: group.orderItems.map((o) => ({ id: o.id })),
        storageFacilityId: null,
        courierId: null,
        dueDate: null,
        invoiceNumber: lastCreatedOrderInvoiceNumber + i++,
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
        storageFacility: true,
        courier: true,
        payments: true,
      },
    });

    return incomingOrders.map((o) => OrderService.convertToDTO(o));
  }

  public async getOutgoingOrders(companyId: string) {
    const outgoingOrders = await this.prismaService.order.findMany({
      where: { fromCompanyId: companyId },
      include: {
        orderItems: { include: { product: true } },
        toCompany: true,
        storageFacility: true,
        courier: true,
        payments: true,
      },
    });

    return outgoingOrders.map((o) => OrderService.convertToDTO(o));
  }

  public async getOrderById(orderId: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true, productItems: true } },
        toCompany: true,
        fromCompany: true,
        storageFacility: true,
        courier: true,
      },
    });

    return OrderService.convertToDTO(order);
  }

  public async getOrdersForStorageFacility(companyId: string) {
    const orders = await this.prismaService.order.findMany({
      where: { storageFacilityId: companyId },
      include: {
        orderItems: { include: { product: true } },
        toCompany: true,
        fromCompany: true,
        storageFacility: true,
        courier: true,
      },
    });

    return orders.map((o) => OrderService.convertToDTO(o));
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus) {
    await this.prismaService.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  public async updateOrder(orderId: string, dto: UpdateOrderDTO) {
    if (!!dto.courierId) {
      const courier = await this.prismaService.user.findFirst({
        where: { id: dto.courierId, role: UserRole.COURIER },
      });

      if (!courier) {
        throw new BadRequestException('User id provided is not a courier');
      }
    }

    const order = await this.prismaService.order.findUniqueOrThrow({
      where: { id: orderId },
    });

    let newStatus: OrderStatus | undefined;

    const jobExists = this.schedulerRegistry.doesExist(
      'cron',
      ORDER_DUE_DATE_PREFIX + order.id
    );

    const startOfToday = new Date();
    const dueDate = new Date(dto.dueDate);

    if (jobExists && dto.dueDate) {
      const job = this.schedulerRegistry.getCronJob(
        ORDER_DUE_DATE_PREFIX + order.id
      );

      if (dueDate < startOfToday) {
        job.stop();
        newStatus = OrderStatus.OVERDUE;
      } else {
        job.setTime(new CronTime(dueDate));
        if (order.status === OrderStatus.OVERDUE) {
          newStatus = OrderStatus.PENDING;
        }
      }
    } else if (dto.dueDate) {
      if (dueDate < startOfToday) {
        newStatus = OrderStatus.OVERDUE;
      } else {
        if (order.status === OrderStatus.OVERDUE) {
          newStatus = OrderStatus.PENDING;
        }

        const job = new CronJob(dueDate, async () => {
          await this.prismaService.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.OVERDUE },
          });
        });

        this.schedulerRegistry.addCronJob(
          ORDER_DUE_DATE_PREFIX + order.id,
          job
        );

        job.start();
      }
    }

    await this.prismaService.order.update({
      where: { id: orderId },
      data: {
        status: newStatus ?? dto.status,
        storageFacilityId: dto.storageFacilityId,
        courierId: dto.courierId,
        dueDate: dto.dueDate && dueDate,
      },
    });
  }

  public static convertToDTO(
    order: Order & {
      orderItems?: (OrderItem & {
        product: Product;
        productItems?: ProductItem[];
      })[];
      toCompany?: Company;
      fromCompany?: Company;
      storageFacility?: Company;
      courier?: User;
      payments?: Payment[];
    }
  ): OrderDTO {
    const toCompany =
      !!order.toCompany && CompanyService.convertToDTO(order.toCompany);
    const fromCompany =
      !!order.fromCompany && CompanyService.convertToDTO(order.fromCompany);
    const storageFacility =
      !!order.storageFacility &&
      CompanyService.convertToDTO(order.storageFacility);
    const courier = !!order.courier && UserService.convertToDTO(order.courier);
    const payments =
      !!order.payments &&
      order.payments.map((p) => PaymentService.convertToDTO(p));

    return {
      ...order,
      orderItems: order.orderItems.map((o) => OrderItemService.convertToDTO(o)),
      status: order.status as OrderStatusEnum,
      toCompany,
      fromCompany,
      storageFacility,
      courier,
      payments,
    };
  }
}
