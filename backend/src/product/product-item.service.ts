import { BadRequestException, Injectable } from '@nestjs/common';
import { Product, ProductItem } from '@prisma/client';
import { PostgresErrorCode } from '../shared/constants/postgress-error-codes.enum';
import { PrismaService } from '../global/prisma/prisma.service';
import { CreateProductItemDTO } from './dto/create-product-item.dto';
import { ProductItemDTO, ProductItemStatusEnum } from './dto/product-item.dto';
import { ProductService } from './product.service';

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
      where: { status, product: { companyId } },
      include: { product: true },
    });

    return productItems.map((p) => ProductItemService.convertToDTO(p));
  }

  public async getProductItemsByStatusAndUser(
    status: ProductItemStatusEnum,
    userId: string
  ) {
    const productItems = await this.prismaService.productItem.findMany({
      where: { status, customerId: userId },
      include: { product: true },
    });

    return productItems.map((p) => ProductItemService.convertToDTO(p));
  }

  public static convertToDTO(
    productItem: ProductItem & { product?: Product }
  ): ProductItemDTO {
    return {
      ...productItem,
      status: productItem.status as ProductItemStatusEnum,
      product:
        productItem.product && ProductService.convertToDTO(productItem.product),
    };
  }
}
