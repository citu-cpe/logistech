import { Injectable } from '@nestjs/common';
import { ProductItem, ProductItemStatus } from '@prisma/client';
import { CustomLogger } from '../../shared/custom-logger';
import { PrismaService } from '../prisma/prisma.service';
import {
  testSupplierProduct,
  testManufacturerProduct,
  testRetailerProduct,
} from './product-test-data.service';

export const testSupplierProductItem: ProductItem = {
  id: '38cd1174-0f34-4fa1-8d62-fafe4a12cbde',
  createdAt: new Date(),
  updatedAt: new Date(),
  rfid: 'f7Gp&T6JoScdoaBJ',
  status: ProductItemStatus.IN_STORAGE,
  productId: testSupplierProduct.id,
  transactionId: null,
  orderItemId: null,
  customerId: null,
  returnedAt: null,
  courierId: null,
  buyerId: null,
};

export const testManufacturerProductItem: ProductItem = {
  id: 'bdd6fc09-dab9-47d3-bf5c-882e058b9dc5',
  createdAt: new Date(),
  updatedAt: new Date(),
  rfid: 'sm!Lhom5XhRQb7&9',
  status: ProductItemStatus.IN_STORAGE,
  productId: testManufacturerProduct.id,
  transactionId: null,
  orderItemId: null,
  customerId: null,
  returnedAt: null,
  courierId: null,
  buyerId: null,
};

export const testRetailerProductItem: ProductItem = {
  id: '5dcfd6de-eccc-4449-9ef2-571d0c4d3056',
  createdAt: new Date(),
  updatedAt: new Date(),
  rfid: null,
  status: ProductItemStatus.IN_STORAGE,
  productId: testRetailerProduct.id,
  transactionId: null,
  orderItemId: null,
  customerId: null,
  returnedAt: null,
  courierId: null,
  buyerId: null,
};

@Injectable()
export class ProductItemTestDataService {
  private readonly logger = new CustomLogger(ProductItemTestDataService.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING PRODUCT ITEM TEST DATA');

    const foundSupplier = await this.prismaService.productItem.findUnique({
      where: { id: testSupplierProduct.id },
    });
    const foundManufacturer = await this.prismaService.productItem.findUnique({
      where: { id: testManufacturerProduct.id },
    });
    const foundRetailer = await this.prismaService.productItem.findUnique({
      where: { id: testRetailerProduct.id },
    });

    if (!foundSupplier) {
      await this.createProduct(testSupplierProductItem);
    }
    if (!foundManufacturer) {
      await this.createProduct(testManufacturerProductItem);
    }
    if (!foundRetailer) {
      await this.createProduct(testRetailerProductItem);
    }

    this.logger.log('DONE GENERATING PRODUCT TEST DATA');
  }

  private async createProduct(productItem: ProductItem) {
    await this.prismaService.productItem.create({
      data: productItem,
    });
  }
}
