import { Injectable } from '@nestjs/common';
import { ProductItem } from '@prisma/client';
import { PrismaService } from '../global/prisma/prisma.service';
import { CreateProductItemDTO } from './dto/create-product-item.dto';
import { ProductItemDTO, ProductItemStatusEnum } from './dto/product-item.dto';

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
    const newProductItem = await this.prismaService.productItem.create({
      data: {
        ...productItem,
        productId,
      },
    });

    return ProductItemService.convertToDTO(newProductItem);
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
    await this.prismaService.productItem.delete({
      where: { id: productItemId },
    });
  }

  public static convertToDTO(productItem: ProductItem): ProductItemDTO {
    return {
      ...productItem,
      status: productItem.status as ProductItemStatusEnum,
    };
  }
}
