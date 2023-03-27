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
  address: 'Supplier St.',
  contactNumber: '+63 999 999 9999',
  email: 'accounting@supplier.com',
};

export const testStorageFacilityCompany: Company = {
  id: 'af272e76-96bc-4fd5-b0ce-dfe2c03a004f',
  createdAt: new Date(),
  updatedAt: new Date(),
  type: CompanyType.STORAGE_FACILITY,
  name: 'STORAGE FACILITY CO.',
  address: 'Storage Facility St.',
  contactNumber: '+63 888 888 8888',
  email: 'accounting@storage_facility.com',
};

export const testNewStorageFacilityCompany: Company = {
  id: '821e1032-73e7-4427-97f7-bb5abd4cd685',
  createdAt: new Date(),
  updatedAt: new Date(),
  type: CompanyType.STORAGE_FACILITY,
  name: 'NEW STORAGE FACILITY CO.',
  address: 'New Storage Facility St.',
  contactNumber: '+63 777 777 7777',
  email: 'accounting@new_storage_facility.com',
};

export const testManufacturerCompany: Company = {
  id: 'cb74150c-8051-4aa4-9243-d1a0f067d881',
  createdAt: new Date(),
  updatedAt: new Date(),
  type: CompanyType.MANUFACTURER,
  name: 'MANUFACTURER CO.',
  address: 'Manufacturer St.',
  contactNumber: '+63 666 666 6666',
  email: 'accounting@manufacturer.com',
};

export const testRetailerCompany: Company = {
  id: '805960d1-a76c-415c-b9d7-ae2d1de0f654',
  createdAt: new Date(),
  updatedAt: new Date(),
  type: CompanyType.RETAILER,
  name: 'RETAILER CO.',
  address: 'Retailer St.',
  contactNumber: '+63 555 555 5555',
  email: 'accounting@retailer.com',
};

export const testNewRetailerCompany: Company = {
  id: 'db0bf4a0-7190-4382-9fd5-501b0797f5eb',
  createdAt: new Date(),
  updatedAt: new Date(),
  type: CompanyType.RETAILER,
  name: 'NEW RETAILER CO.',
  address: 'New Retailer St.',
  contactNumber: '+63 444 444 4444',
  email: 'accounting@new_retailer.com',
};

@Injectable()
export class CompanyTestDataService {
  private readonly logger = new CustomLogger(CompanyTestDataService.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING COMPANY TEST DATA');

    const foundStorageFacility = await this.prismaService.company.findUnique({
      where: { id: testStorageFacilityCompany.id },
    });
    const foundNewStorageCompany = await this.prismaService.company.findUnique({
      where: { id: testNewStorageFacilityCompany.id },
    });
    const foundSupplier = await this.prismaService.company.findUnique({
      where: { id: testSupplierCompany.id },
    });
    const foundManufacturer = await this.prismaService.company.findUnique({
      where: { id: testManufacturerCompany.id },
    });
    const foundRetailer = await this.prismaService.company.findUnique({
      where: { id: testRetailerCompany.id },
    });
    const foundNewRetailer = await this.prismaService.company.findUnique({
      where: { id: testNewRetailerCompany.id },
    });

    if (!foundStorageFacility) {
      this.logger.log('GENERATING TEST STORAGE_FACILITY COMPANY');
      await this.createCompany(testStorageFacilityCompany);
    }
    if (!foundNewStorageCompany) {
      this.logger.log('GENERATING NEW TEST STORAGE_FACILITY COMPANY');
      await this.createCompany(testNewStorageFacilityCompany);
    }
    if (!foundSupplier) {
      this.logger.log('GENERATING TEST SUPPLIER COMPANY');
      await this.createCompany(
        testSupplierCompany,
        [],
        [testStorageFacilityCompany.id]
      );
    }
    if (!foundManufacturer) {
      this.logger.log('GENERATING TEST MANUFACTURER COMPANY');
      await this.createCompany(
        testManufacturerCompany,
        [],
        [testStorageFacilityCompany.id]
      );
    }
    if (!foundRetailer) {
      this.logger.log('GENERATING TEST RETAILER COMPANY');
      await this.createCompany(
        testRetailerCompany,
        [],
        [testStorageFacilityCompany.id]
      );
    }
    if (!foundNewRetailer) {
      this.logger.log('GENERATING TEST NEW RETAILER COMPANY');
      await this.createCompany(
        testNewRetailerCompany,
        [],
        [testStorageFacilityCompany.id]
      );
    }

    this.logger.log('DONE GENERATING COMPANY TEST DATA');
  }

  private async createCompany(
    company: Company,
    sellerPartnerIds?: string[],
    storageFacilityPartnerIds?: string[]
  ) {
    const sellerPartners = sellerPartnerIds
      ? sellerPartnerIds?.map((id) => ({
          id,
        }))
      : [];
    const storageFacilityPartners = storageFacilityPartnerIds
      ? storageFacilityPartnerIds.map((id) => ({
          id,
        }))
      : [];

    await this.prismaService.company.create({
      data: {
        ...company,
        sellerPartners: { connect: sellerPartners },
        storageFacilityPartners: { connect: storageFacilityPartners },
      },
    });
    await this.prismaService.cart.create({
      data: { total: 0, companyId: company.id },
    });
  }
}
