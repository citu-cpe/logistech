import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CustomLogger } from '../../shared/custom-logger';
import { PrismaService } from '../prisma/prisma.service';
import {
  testSupplierCompany,
  testManufacturerCompany,
  testRetailerCompany,
} from './company-test-data.service';

export const testSupplierProduct: Product = {
  id: '38cd1174-0f34-4fa1-8d62-fafe4a12cbde',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: '16x2 LCD Screen',
  price: 100,
  bulk: true,
  bulkQuantity: 12,
  companyId: testSupplierCompany.id,
};

export const testManufacturerProduct: Product = {
  id: 'bdd6fc09-dab9-47d3-bf5c-882e058b9dc5',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'Handheld console',
  price: 1000,
  bulk: false,
  bulkQuantity: null,
  companyId: testManufacturerCompany.id,
};

export const testRetailerProduct: Product = {
  id: '5dcfd6de-eccc-4449-9ef2-571d0c4d3056',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'Gameboy',
  price: 10000,
  bulk: false,
  bulkQuantity: null,
  companyId: testRetailerCompany.id,
};

@Injectable()
export class ProductTestDataService {
  private readonly logger = new CustomLogger(ProductTestDataService.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING PRODUCT TEST DATA');

    const foundSupplier = await this.prismaService.product.findUnique({
      where: { id: testSupplierProduct.id },
    });
    const foundManufacturer = await this.prismaService.product.findUnique({
      where: { id: testManufacturerProduct.id },
    });
    const foundRetailer = await this.prismaService.product.findUnique({
      where: { id: testRetailerProduct.id },
    });

    if (!foundSupplier) {
      await this.createProduct(testSupplierProduct);
    }
    if (!foundManufacturer) {
      await this.createProduct(testManufacturerProduct);
    }
    if (!foundRetailer) {
      await this.createProduct(testRetailerProduct);
    }

    this.logger.log('DONE GENERATING PRODUCT TEST DATA');
  }

  private async createProduct(product: Product) {
    await this.prismaService.product.create({
      data: product,
    });
  }
}
