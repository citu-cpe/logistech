import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Cart,
  Company,
  OrderItem,
  Product,
  ProductItemStatus,
} from '@prisma/client';
import { PrismaService } from '../global/prisma/prisma.service';
import { CartDTO, OrderItemGroup } from './dto/cart.dto';
import { CompanyTypeEnum } from '../company/dto/company.dto';
import { CreateOrderItemDTO } from '../order/dto/create-order-item.dto';
import { OrderItemService } from '../order/order-item.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderItemService: OrderItemService
  ) {}

  public async addOrderItemToCart(companyId: string, dto: CreateOrderItemDTO) {
    const cart = await this.prismaService.cart.findUnique({
      where: { companyId },
      include: { orderItems: { include: { product: true } } },
    });
    await this.validateInStock(dto.productId, dto.quantity, cart.id);
    const productIds = cart.orderItems.map((o) => o.productId);
    if (productIds.includes(dto.productId)) {
      const products = cart.orderItems.map((o) => o.product);
      const product = products.find((p) => p.id === dto.productId);

      await this.prismaService.cart.update({
        where: { companyId },
        data: { total: { increment: product.price } },
      });

      await this.prismaService.orderItem.updateMany({
        where: {
          cartId: cart.id,
          productId: dto.productId,
        },
        data: { quantity: { increment: 1 } },
      });

      return;
    }
    const orderItem = await this.orderItemService.createOrderItem(dto, cart.id);

    await this.prismaService.cart.update({
      where: { companyId },
      data: { total: { increment: orderItem.total } },
    });
  }

  public async getCart(companyId: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: { companyId },
      include: {
        orderItems: {
          include: { owningCompany: true, product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return CartService.convertToDTO(cart);
  }

  private static convertToDTO(
    cart: Cart & {
      orderItems: (OrderItem & {
        product: Product;
        owningCompany: Company;
      })[];
    }
  ): CartDTO {
    const companies = new Map<string, Company>();
    const groupedOrderItems: OrderItemGroup[] = [];

    for (const orderItem of cart.orderItems) {
      if (!companies.has(orderItem.owningCompanyId)) {
        companies.set(orderItem.owningCompanyId, orderItem.owningCompany);
      }
    }

    for (const company of companies) {
      const companyOrderItems = cart.orderItems.filter(
        (o) => o.owningCompanyId === company[0]
      );

      const companyEntity = company[1];
      const orderItems = companyOrderItems.map((o) =>
        OrderItemService.convertToDTO(o)
      );
      const total = orderItems.reduce((sum, o) => {
        return sum + o.total;
      }, 0);
      groupedOrderItems.push({
        company: {
          ...companyEntity,
          type: companyEntity.type as CompanyTypeEnum,
        },
        orderItems,
        total,
      });
    }
    return {
      ...cart,
      groupedOrderItems,
    };
  }

  private async validateInStock(
    productId: string,
    quantity: number,
    cartId?: string
  ) {
    const availableProductItems = await this.prismaService.productItem.findMany(
      {
        where: {
          productId,
          status: ProductItemStatus.IN_STORAGE,
        },
      }
    );
    const orderItem = await this.prismaService.orderItem.findFirst({
      where: { cartId, productId },
    });

    let existingQuantity = 0;
    if (!!orderItem) {
      existingQuantity = orderItem.quantity;
    }

    if (quantity + existingQuantity > availableProductItems.length) {
      throw new BadRequestException('Out of stock');
    }
  }
}
