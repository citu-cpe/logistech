import { BadRequestException, Injectable } from '@nestjs/common';
import {
  OrderItem,
  Product,
  ProductItem,
  ProductItemStatus,
} from '@prisma/client';
import { PrismaService } from '../global/prisma/prisma.service';
import { ProductItemService } from '../product/product-item.service';
import { ProductService } from '../product/product.service';
import { CreateOrderItemDTO } from './dto/create-order-item.dto';
import { OrderItemDTO } from './dto/order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createOrderItem(dto: CreateOrderItemDTO, cartId: string) {
    await this.validateInStock(dto.productId, dto.quantity, cartId);

    const owningCompanyId = (
      await this.prismaService.product.findUnique({
        where: { id: dto.productId },
        select: { companyId: true },
      })
    ).companyId;

    const orderItem = await this.prismaService.orderItem.create({
      data: { ...dto, owningCompanyId, cartId },
      include: { product: true },
    });

    return OrderItemService.convertToDTO(orderItem);
  }

  public async editOrderItem(id: string, dto: CreateOrderItemDTO) {
    await this.validateInStock(dto.productId, dto.quantity);

    const orderItem = await this.prismaService.orderItem.findUnique({
      where: { id },
      include: { product: true },
    });

    await this.prismaService.orderItem.update({
      where: { id },
      data: { quantity: dto.quantity },
    });

    await this.prismaService.cart.update({
      where: { id: orderItem.cartId },
      data: {
        total: {
          increment:
            dto.quantity * orderItem.product.price -
            orderItem.quantity * orderItem.product.price,
        },
      },
    });
  }

  public async deleteOrderItem(id: string) {
    const orderItem = await this.prismaService.orderItem.findUnique({
      where: { id },
      include: { product: true },
    });

    await this.prismaService.orderItem.delete({ where: { id } });

    await this.prismaService.cart.update({
      where: { id: orderItem.cartId },
      data: {
        total: { decrement: orderItem.quantity * orderItem.product.price },
      },
    });
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
    const orderItems = await this.prismaService.orderItem.findMany({
      where: { cartId, productId },
    });

    const existingQuantity = cartId ? orderItems.length : 0;

    if (quantity + existingQuantity > availableProductItems.length) {
      throw new BadRequestException('Out of stock');
    }
  }

  public static convertToDTO(
    orderItem: OrderItem & { product: Product; productItems?: ProductItem[] }
  ): OrderItemDTO {
    return {
      ...orderItem,
      product: ProductService.convertToDTO(orderItem.product),
      productItems:
        !!orderItem.productItems &&
        orderItem.productItems.map((p) => ProductItemService.convertToDTO(p)),
      total: orderItem.quantity * orderItem.product.price,
    };
  }
}
