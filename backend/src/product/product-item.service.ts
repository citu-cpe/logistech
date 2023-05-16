import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Company,
  CompanyType,
  OrderItem,
  OrderStatus,
  Product,
  ProductItem,
  ProductItemStatus,
  User,
} from '@prisma/client';
import { PostgresErrorCode } from '../shared/constants/postgress-error-codes.enum';
import { PrismaService } from '../global/prisma/prisma.service';
import { CreateProductItemDTO } from './dto/create-product-item.dto';
import { ProductItemDTO, ProductItemStatusEnum } from './dto/product-item.dto';
import { ProductService } from './product.service';
import { ProductItemStatusQuantityDTO } from './dto/product-item-status-quantity.dto';
import { UpdateProductItemStatusDTO } from './dto/update-product-item-status.dto';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class ProductItemService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getProductItemsByProductId(productId: string) {
    const productItems = await this.prismaService.productItem.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    return productItems.map((p) => ProductItemService.convertToDTO(p));
  }

  public async createProductItem(
    productItem: CreateProductItemDTO,
    productId: string
  ) {
    try {
      const newProductItem = await this.prismaService.productItem.create({
        data: {
          ...productItem,
          productId,
        },
      });

      return ProductItemService.convertToDTO(newProductItem);
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(
          'Product item with this RFID already exists'
        );
      }
    }
  }

  public async createManyProductItems(
    productItems: CreateProductItemDTO[],
    productId: string
  ) {
    const newProductItems = productItems.map((p) => ({
      ...p,
      productId,
    }));

    await this.prismaService.productItem.createMany({
      data: newProductItems,
    });
  }

  public async editProductItem(
    productItem: CreateProductItemDTO,
    productItemId: string
  ) {
    return this.prismaService.productItem.update({
      where: { id: productItemId },
      data: productItem,
    });
  }

  public async updateProductItemStatus(
    productItemId: string,
    dto: UpdateProductItemStatusDTO
  ) {
    return this.prismaService.productItem.update({
      where: { id: productItemId },
      data: { status: dto.status },
    });
  }

  public async deleteProductItem(productItemId: string) {
    const productItem = await this.prismaService.productItem.findUnique({
      where: { id: productItemId },
    });

    if (productItem.status !== ProductItemStatusEnum.IN_STORAGE) {
      throw new BadRequestException(
        'Product items not "IN STORAGE" cannot be deleted'
      );
    }

    await this.prismaService.productItem.delete({
      where: { id: productItemId },
    });
  }

  public async getProductItemsByStatus(
    status: ProductItemStatusEnum,
    companyId: string
  ) {
    const productItems = await this.prismaService.productItem.findMany({
      where: {
        status,
        OR: [
          { product: { companyId } },
          { orderItem: { order: { storageFacilityId: companyId } } },
        ],
      },
      include: {
        product: { include: { company: true } },
        courier: true,
        customer: true,
        buyer: true,
      },
    });

    return productItems.map((p) => ProductItemService.convertToDTO(p));
  }

  public async getProductItemsByStatusAndUser(
    status: ProductItemStatusEnum,
    userId: string
  ) {
    const productItems = await this.prismaService.productItem.findMany({
      where: { status, customerId: userId },
      include: { product: true, buyer: true, customer: true },
    });

    return productItems.map((p) => ProductItemService.convertToDTO(p));
  }

  public async getProductItemStatusQuantity(companyId: string) {
    const company = await this.prismaService.company.findUnique({
      where: { id: companyId },
    });
    const nonStorageFacilityWhere = { product: { companyId } };
    const storageFacilityWhere = {
      orderItem: { order: { storageFacilityId: companyId } },
    };

    const counts = await this.prismaService.productItem.groupBy({
      by: ['status'],
      where:
        company.type === CompanyType.STORAGE_FACILITY
          ? storageFacilityWhere
          : nonStorageFacilityWhere,
      _count: { id: true },
    });

    const orders = await this.prismaService.order.findMany({
      where: {
        storageFacilityId: companyId,
        status: { not: OrderStatus.PAID },
      },
    });

    const productItemStatusQuantity = new ProductItemStatusQuantityDTO();
    productItemStatusQuantity.onHold = 0;
    productItemStatusQuantity.inStorage = 0;
    productItemStatusQuantity.toBePickedUp = 0;
    productItemStatusQuantity.inTransit = 0;
    productItemStatusQuantity.complete = 0;
    productItemStatusQuantity.canceled = 0;
    productItemStatusQuantity.redFlag = 0;
    productItemStatusQuantity.orders = orders.length;

    for (const count of counts) {
      switch (count.status) {
        case ProductItemStatus.ON_HOLD:
          productItemStatusQuantity.onHold = count._count.id;
          break;
        case ProductItemStatus.IN_STORAGE:
          productItemStatusQuantity.inStorage = count._count.id;
          break;
        case ProductItemStatus.TO_BE_PICKED_UP:
          productItemStatusQuantity.toBePickedUp = count._count.id;
          break;
        case ProductItemStatus.IN_TRANSIT:
          productItemStatusQuantity.inTransit = count._count.id;
          break;
        case ProductItemStatus.COMPLETE:
          productItemStatusQuantity.complete = count._count.id;
          break;
        case ProductItemStatus.CANCELED:
          productItemStatusQuantity.canceled = count._count.id;
          break;
        case ProductItemStatus.RED_FLAG:
          productItemStatusQuantity.redFlag = count._count.id;
          break;
      }
    }

    return productItemStatusQuantity;
  }

  public async returnProductItem(productItemId: string, customerId: string) {
    const customer = await this.prismaService.user.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new BadRequestException('Only customers can return product items');
    }

    await this.prismaService.productItem.update({
      where: { id: productItemId },
      data: { status: ProductItemStatus.RETURNING, returnedAt: new Date() },
    });
  }

  public async getCourierAssignedProductItems(userId: string) {
    const orders = await this.prismaService.order.findMany({
      where: { courierId: userId },
      include: {
        orderItems: {
          include: {
            productItems: {
              include: { product: true, customer: true, buyer: true },
            },
          },
        },
      },
    });

    const orderItems: (OrderItem & { productItems: ProductItem[] })[] = [];

    orders.forEach((o) => orderItems.push(...o.orderItems));

    const productItems: ProductItem[] = [];

    orderItems.forEach((o) => productItems.push(...o.productItems));

    const toBePickedUpProductItems = productItems
      .filter((p) => p.status === ProductItemStatusEnum.TO_BE_PICKED_UP)
      .map((p) => ProductItemService.convertToDTO(p));
    const inTransitProductItems = productItems
      .filter((p) => p.status === ProductItemStatusEnum.IN_TRANSIT)
      .map((p) => ProductItemService.convertToDTO(p));

    const returningItems = await this.prismaService.productItem.findMany({
      where: { courierId: userId, status: ProductItemStatus.RETURNING },
      include: {
        product: { include: { company: true } },
        customer: true,
        courier: true,
        buyer: true,
      },
    });

    const returningProductItems = returningItems.map((r) =>
      ProductItemService.convertToDTO(r)
    );

    return {
      toBePickedUpProductItems,
      inTransitProductItems,
      returningProductItems,
    };
  }

  public async getReturnedProductItems(userId: string) {
    const productItems = await this.prismaService.productItem.findMany({
      where: {
        customerId: userId,
        status: {
          in: [ProductItemStatus.RETURNING, ProductItemStatus.RETURNED],
        },
      },
      include: { product: true, buyer: true, customer: true },
    });

    return productItems.map((p) => ProductItemService.convertToDTO(p));
  }

  public async assignCourierToProductItem(
    productItemId: string,
    courierId: string
  ) {
    await this.prismaService.productItem.update({
      where: { id: productItemId },
      data: { courier: { connect: { id: courierId } } },
    });
  }

  public static convertToDTO(
    productItem: ProductItem & {
      product?: Product & { company?: Company };
      customer?: User;
      courier?: User;
      buyer?: Company;
    }
  ): ProductItemDTO {
    return {
      ...productItem,
      status: productItem.status as ProductItemStatusEnum,
      product:
        productItem.product && ProductService.convertToDTO(productItem.product),
      customer: productItem.customer
        ? UserService.convertToDTO(productItem.customer)
        : undefined,
      courier: productItem.courier
        ? UserService.convertToDTO(productItem.courier)
        : undefined,
      buyer: productItem.buyer
        ? CompanyService.convertToDTO(productItem.buyer)
        : undefined,
    };
  }
}
