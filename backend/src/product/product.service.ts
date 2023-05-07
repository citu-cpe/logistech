import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Cart,
  Company,
  Order,
  OrderItem,
  Prisma,
  Product,
  ProductItem,
  ProductItemStatus,
} from '@prisma/client';
import { CompanyTypeEnum } from '../company/dto/company.dto';
import { PrismaService } from '../global/prisma/prisma.service';
import { OrderItemService } from '../order/order-item.service';
import { PostgresErrorCode } from '../shared/constants/postgress-error-codes.enum';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getProductsForCompany(companyId: string) {
    const products = await this.prismaService.product.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: {
        company: true,
        productItems: { where: { status: ProductItemStatus.IN_STORAGE } },
      },
    });

    return products.map((i) => ProductService.convertToDTO(i));
  }

  public async getCommerceProducts(
    companyTypes: CompanyTypeEnum[],
    companyId: string
  ): Promise<ProductDTO[]> {
    let cart: Cart;

    try {
      cart = await this.prismaService.cart.findFirstOrThrow({
        where: { OR: [{ companyId }, { customerId: companyId }] },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === PostgresErrorCode.NotFound) {
          throw new NotFoundException('Cart not found');
        }
      }
    }

    const products = await this.prismaService.product.findMany({
      where: {
        company: { id: { not: companyId }, type: { in: companyTypes } },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        company: true,
        productItems: { where: { status: ProductItemStatus.IN_STORAGE } },
        orderItems: {
          where: { cartId: cart.id, orderId: null },
          include: {
            product: true,
            order: { include: { fromCompany: true, toCompany: true } },
          },
        },
      },
    });

    return products.map((p) => ProductService.convertToDTO(p));
  }

  public async getTopTenProducts(companyId: string) {
    const products = await this.prismaService.product.findMany({
      where: {
        company: { id: companyId },
      },
      take: 10,
      include: {
        company: true,
      },
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
    product: Product & {
      company?: Company;
      productItems?: ProductItem[];
      orderItems?: (OrderItem & { product: Product; order: Order })[];
    }
  ): ProductDTO {
    return {
      ...product,
      numInStock: product.productItems ? product.productItems.length : 0,
      company: product.company && {
        ...product.company,
        type: product.company.type as CompanyTypeEnum,
      },
      orderItems:
        product.orderItems &&
        product.orderItems.map((oi) => OrderItemService.convertToDTO(oi)),
      numInCart: product.orderItems
        ? product.orderItems.reduce((prev, next) => prev + next.quantity, 0)
        : 0,
    };
  }
}
