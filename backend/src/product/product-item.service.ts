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
import { CourierIdDTO } from './dto/courier-id.dto';
import { CourierProductItemsDTO } from './dto/courier-product-items.dto';

@Injectable()
export class ProductItemService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getProductItemsByProductId(productId: string) {
    const productItems = await this.prismaService.productItem.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: { product: true, courier: true },
    });

    return productItems.map((p) => ProductItemService.convertToDTO(p));
  }

  public async getProductItemsByCompanyId(companyId: string) {
    const productItems = await this.prismaService.productItem.findMany({
      where: {
        OR: [
          {
            product: { companyId },
            status: { not: ProductItemStatus.COMPLETE },
          },
          { buyerId: companyId, status: ProductItemStatus.COMPLETE },
          {
            orderItem: { order: { storageFacilityId: companyId } },
            status: ProductItemStatus.IN_STORAGE_FACILITY,
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { product: true, courier: true },
    });

    return productItems.map((p) => ProductItemService.convertToDTO(p));
  }

  public async createProductItem(
    productItem: CreateProductItemDTO,
    productId: string
  ) {
    let rfid: string;

    if (productItem.rfid?.length === 0) {
      rfid = null;
    } else {
      rfid = productItem.rfid;
    }

    try {
      const newProductItem = await this.prismaService.productItem.create({
        data: {
          ...productItem,
          rfid,
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
    dto: CreateProductItemDTO,
    productItemId: string
  ) {
    const productItem = await this.prismaService.productItem.findUnique({
      where: { id: productItemId },
      include: { orderItem: { include: { order: true } } },
    });

    const order = productItem.orderItem?.order;

    if (
      order &&
      order.status !== OrderStatus.PAID &&
      dto.status === ProductItemStatusEnum.IN_TRANSIT_TO_STORAGE_FACILITY
    ) {
      throw new BadRequestException(
        'Items that are not paid cannot be picked up'
      );
    }

    try {
      await this.prismaService.productItem.update({
        where: { id: productItemId },
        data: dto,
      });
    } catch (e) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(
          'Product item with this RFID already exists'
        );
      }
    }
  }

  public async updateProductItemStatus(
    productItemId: string,
    dto: UpdateProductItemStatusDTO
  ) {
    const productItem = await this.prismaService.productItem.findUnique({
      where: { id: productItemId },
      include: { orderItem: { include: { order: true } }, buyer: true },
    });

    const order = productItem.orderItem.order;

    if (
      order.status !== OrderStatus.PAID &&
      dto.status === ProductItemStatusEnum.IN_TRANSIT_TO_STORAGE_FACILITY
    ) {
      throw new BadRequestException(
        'Items that are not paid cannot be picked up'
      );
    }

    const setCourierToNull =
      dto.status === ProductItemStatusEnum.IN_STORAGE_FACILITY ||
      dto.status === ProductItemStatusEnum.COMPLETE;

    await this.prismaService.productItem.update({
      where: { id: productItemId },
      data: {
        status: dto.status,
        rfid:
          dto.status === ProductItemStatusEnum.COMPLETE &&
          (!!productItem.customerId ||
            productItem.buyer.type === CompanyType.RETAILER)
            ? null
            : productItem.rfid,
        returnedAt:
          dto.status === ProductItemStatusEnum.RETURNED ? new Date() : null,
      },
    });

    if (setCourierToNull) {
      await this.prismaService.productItem.update({
        where: { id: productItemId },
        data: {
          courier: { disconnect: true },
        },
      });
    }
  }

  public async deleteProductItem(productItemId: string) {
    const productItem = await this.prismaService.productItem.findUnique({
      where: { id: productItemId },
    });

    if (productItem.status !== ProductItemStatus.IN_STORAGE) {
      throw new BadRequestException(
        'Product items not "IN STORAGE" cannot be deleted'
      );
    }

    await this.prismaService.productItem.delete({
      where: { id: productItemId },
    });
  }

  public async getProductItemsByStatus(
    status: ProductItemStatusEnum[],
    companyId: string
  ) {
    const productItems = await this.prismaService.productItem.findMany({
      where: {
        status: { in: status },
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

  public async getOrderedProductItemsByStatus(
    status: ProductItemStatusEnum[],
    companyId: string
  ) {
    const productItems = await this.prismaService.productItem.findMany({
      where: {
        status: { in: status },
        OR: [
          { buyerId: companyId },
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
    status: ProductItemStatusEnum[],
    userId: string
  ) {
    const productItems = await this.prismaService.productItem.findMany({
      where: { status: { in: status }, customerId: userId },
      include: { product: true, buyer: true, customer: true, courier: true },
    });

    return productItems.map((p) => ProductItemService.convertToDTO(p));
  }

  public async getProductItemStatusQuantity(
    companyId: string,
    dto: CourierIdDTO
  ) {
    const courierId = dto.courierId;

    const company = await this.prismaService.company.findUnique({
      where: { id: companyId },
    });
    const user = await this.prismaService.user.findUnique({
      where: { id: companyId },
    });

    const isCustomer = !company && !!user;

    const nonStorageFacilityWhere = { product: { companyId } };
    const storageFacilityWhere = {
      orderItem: { order: { storageFacilityId: companyId } },
    };
    const courierWhere = {
      orderItem: { order: { storageFacilityId: companyId } },
      courierId,
    };
    const customerWhere = {
      customerId: companyId,
    };

    const counts = await this.prismaService.productItem.groupBy({
      by: ['status'],
      where: isCustomer
        ? customerWhere
        : company.type === CompanyType.STORAGE_FACILITY && !courierId
        ? storageFacilityWhere
        : company.type === CompanyType.STORAGE_FACILITY && !!courierId
        ? courierWhere
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
    productItemStatusQuantity.inTransitToStorageFacility = 0;
    productItemStatusQuantity.inStorageFacility = 0;
    productItemStatusQuantity.inTransitToBuyer = 0;
    productItemStatusQuantity.complete = 0;
    productItemStatusQuantity.canceled = 0;
    productItemStatusQuantity.redFlag = 0;
    productItemStatusQuantity.returnRequested = 0;
    productItemStatusQuantity.returnAccepted = 0;
    productItemStatusQuantity.returnRejected = 0;
    productItemStatusQuantity.inTransitToSeller = 0;
    productItemStatusQuantity.returned = 0;
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
        case ProductItemStatus.IN_TRANSIT_TO_STORAGE_FACILITY:
          productItemStatusQuantity.inTransitToStorageFacility =
            count._count.id;
          break;
        case ProductItemStatus.IN_STORAGE_FACILITY:
          productItemStatusQuantity.inStorageFacility = count._count.id;
          break;
        case ProductItemStatus.IN_TRANSIT_TO_BUYER:
          productItemStatusQuantity.inTransitToBuyer = count._count.id;
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
        case ProductItemStatus.RETURN_REQUESTED:
          productItemStatusQuantity.returnRequested = count._count.id;
          break;
        case ProductItemStatus.RETURN_ACCEPTED:
          productItemStatusQuantity.returnAccepted = count._count.id;
          break;
        case ProductItemStatus.RETURN_REJECTED:
          productItemStatusQuantity.returnRejected = count._count.id;
          break;
        case ProductItemStatus.IN_TRANSIT_TO_SELLER:
          productItemStatusQuantity.inTransitToSeller = count._count.id;
          break;
        case ProductItemStatus.RETURNED:
          productItemStatusQuantity.returned = count._count.id;
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
      data: { status: ProductItemStatus.RETURN_REQUESTED },
    });
  }

  public async getCourierAssignedProductItems(
    userId: string
  ): Promise<CourierProductItemsDTO> {
    const orders = await this.prismaService.order.findMany({
      where: { courierId: userId },
      include: {
        orderItems: {
          include: {
            productItems: {
              include: {
                product: { include: { company: true } },
                customer: true,
                buyer: true,
                courier: true,
              },
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

    const inTransitToStorageFacilityProductItems = productItems
      .filter(
        (p) => p.status === ProductItemStatusEnum.IN_TRANSIT_TO_STORAGE_FACILITY
      )
      .map((p) => ProductItemService.convertToDTO(p));

    const inStorageFacilityProductItems = productItems
      .filter((p) => p.status === ProductItemStatusEnum.IN_STORAGE_FACILITY)
      .map((p) => ProductItemService.convertToDTO(p));

    const inTransitToBuyerProductItems = productItems
      .filter((p) => p.status === ProductItemStatusEnum.IN_TRANSIT_TO_BUYER)
      .map((p) => ProductItemService.convertToDTO(p));

    const inTransitToSellerProductItems = productItems
      .filter((p) => p.status === ProductItemStatusEnum.IN_TRANSIT_TO_SELLER)
      .map((p) => ProductItemService.convertToDTO(p));

    const returnAcceptedItems = await this.prismaService.productItem.findMany({
      where: { courierId: userId, status: ProductItemStatus.RETURN_ACCEPTED },
      include: {
        product: { include: { company: true } },
        customer: true,
        courier: true,
        buyer: true,
      },
    });

    const returnAcceptedProductItems = returnAcceptedItems.map((r) =>
      ProductItemService.convertToDTO(r)
    );

    return {
      toBePickedUpProductItems,
      inTransitToStorageFacilityProductItems,
      inStorageFacilityProductItems,
      inTransitToBuyerProductItems,
      returnAcceptedProductItems,
      inTransitToSellerProductItems,
    };
  }

  public async getReturnedProductItems(userId: string) {
    const productItems = await this.prismaService.productItem.findMany({
      where: {
        customerId: userId,
        status: {
          in: [
            ProductItemStatus.RETURN_REQUESTED,
            ProductItemStatus.RETURN_ACCEPTED,
            ProductItemStatus.RETURN_REJECTED,
            ProductItemStatus.RETURNED,
          ],
        },
      },
      include: { product: true, buyer: true, customer: true, courier: true },
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

  public async assignRfidToProductItem(productItemId: string, rfid: string) {
    await this.prismaService.productItem.update({
      where: { id: productItemId },
      data: { rfid },
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
