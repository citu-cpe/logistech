import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/prisma/prisma.service';
import { CustomLogger } from '../../shared/custom-logger';
import { Company, CompanyType } from '@prisma/client';

export const testSupplierCompany: Company = {
  id: 'ae236251-db62-4f10-b5d7-7c9b87690eb1',
  createdAt: new Date(),
  updatedAt: new Date(),
  type: CompanyType.SUPPLIER,
  name: 'SUPPLIER CO.',
};

export const testStorageFacilityCompany: Company = {
  id: 'af272e76-96bc-4fd5-b0ce-dfe2c03a004f',
  createdAt: new Date(),
  updatedAt: new Date(),
  type: CompanyType.STORAGE_FACILITY,
  name: 'STORAGE FACILITY CO.',
};

export const testCourierCompany: Company = {
  id: '5f90de3d-ca51-4f23-81ec-a70d5374bf36',
  createdAt: new Date(),
  updatedAt: new Date(),
  type: CompanyType.COURIER,
  name: 'COURIER CO.',
};

export const testManufacturerCompany: Company = {
  id: 'cb74150c-8051-4aa4-9243-d1a0f067d881',
  createdAt: new Date(),
  updatedAt: new Date(),
  type: CompanyType.MANUFACTURER,
  name: 'MANUFACTURER CO.',
};

export const testRetailerCompany: Company = {
  id: '805960d1-a76c-415c-b9d7-ae2d1de0f654',
  createdAt: new Date(),
  updatedAt: new Date(),
  type: CompanyType.RETAILER,
  name: 'RETAILER CO.',
};

@Injectable()
export class CompanyTestDataService {
  private readonly logger = new CustomLogger(CompanyTestDataService.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING COMPANY TEST DATA');

    const foundSupplier = await this.prismaService.company.findUnique({
      where: { id: testSupplierCompany.id },
    });
    const foundStorageFacility = await this.prismaService.company.findUnique({
      where: { id: testStorageFacilityCompany.id },
    });
    const foundCourier = await this.prismaService.company.findUnique({
      where: { id: testCourierCompany.id },
    });
    const foundManufacturer = await this.prismaService.company.findUnique({
      where: { id: testManufacturerCompany.id },
    });
    const foundRetailer = await this.prismaService.company.findUnique({
      where: { id: testRetailerCompany.id },
    });

    if (!foundSupplier) {
      this.logger.log('GENERATING TEST SUPPLIER COMPANY');
      await this.createCompany(testSupplierCompany);
    }
    if (!foundStorageFacility) {
      this.logger.log('GENERATING TEST STORAGE_FACILITY COMPANY');
      await this.createCompany(testStorageFacilityCompany);
    }
    if (!foundCourier) {
      this.logger.log('GENERATING TEST COURIER COMPANY');
      await this.createCompany(testCourierCompany);
    }
    if (!foundManufacturer) {
      this.logger.log('GENERATING TEST MANUFACTURER COMPANY');
      await this.createCompany(testManufacturerCompany);
    }
    if (!foundRetailer) {
      this.logger.log('GENERATING TEST RETAILER COMPANY');
      await this.createCompany(testRetailerCompany);
    }

    this.logger.log('DONE GENERATING COMPANY TEST DATA');
  }

  private async createCompany(company: Company) {
    await this.prismaService.company.create({
      data: company,
    });
  }
}
