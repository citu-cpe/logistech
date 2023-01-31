import { Injectable } from '@nestjs/common';
import { Company, Product } from '@prisma/client';
import { CompanyTypeEnum } from '../company/dto/company.dto';
import { PrismaService } from '../global/prisma/prisma.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getProductsForCompany(companyId: string) {
    const products = await this.prismaService.product.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((i) => ProductService.convertToDTO(i));
  }

  public async getCommerceProducts(type: CompanyTypeEnum) {
    const products = await this.prismaService.product.findMany({
      where: { company: { type } },
      orderBy: { createdAt: 'desc' },
      include: { company: true },
    });

    return products.map((p) => ProductService.convertToDTO(p));
  }

  public async createProduct(product: CreateProductDTO, companyId: string) {
    return this.prismaService.product.create({
      data: {
        ...product,
        companyId,
      },
    });
  }

  public async editProduct(product: CreateProductDTO, productId: string) {
    const { name, price, bulk, bulkQuantity }: CreateProductDTO = product;
    return this.prismaService.product.update({
      where: { id: productId },
      data: { name, price, bulk, bulkQuantity },
    });
  }

  public async deleteProduct(productId: string) {
    return this.prismaService.product.delete({ where: { id: productId } });
  }

  public static convertToDTO(
    product: Product & { company?: Company }
  ): ProductDTO {
    return {
      ...product,
      company: !!product.company && {
        ...product.company,
        type: product.company.type as CompanyTypeEnum,
      },
    };
  }
}
