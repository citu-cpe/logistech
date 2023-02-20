import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { CustomLogger } from '../../shared/custom-logger';
import { User, UserRole } from '@prisma/client';
import {
  testManufacturerCompany,
  testNewStorageFacilityCompany,
  testRetailerCompany,
  testStorageFacilityCompany,
  testSupplierCompany,
} from './company-test-data.service';

export const testCustomer: User = {
  id: '2f54ca0b-e389-4e17-a978-0cb98e0f7a46',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test_customer@test.com',
  username: 'test_customer',
  password: 'test',
  currentHashedRefreshToken: undefined,
  companyId: undefined,
  role: UserRole.CUSTOMER,
};

export const testSupplier: User = {
  id: '2cf38670-0a8a-41e9-9018-e8b8a9b36486',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test_supplier@test.com',
  username: 'test_supplier',
  password: 'test',
  currentHashedRefreshToken: undefined,
  role: UserRole.SUPPLIER_SUPERVISOR,
  companyId: testSupplierCompany.id,
};

export const testStorageFacility: User = {
  id: 'bb552f70-c234-4ec2-9bc0-d0bc2893f0d2',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test_storage_facility@test.com',
  username: 'test_storage_facility',
  password: 'test',
  currentHashedRefreshToken: undefined,
  role: UserRole.STORAGE_FACILITY_SUPERVISOR,
  companyId: testStorageFacilityCompany.id,
};

export const testNewStorageFacility: User = {
  id: 'c905734d-4770-4338-8694-b1ccf154d523',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test_new_storage_facility@test.com',
  username: 'test_new_storage_facility',
  password: 'test',
  currentHashedRefreshToken: undefined,
  role: UserRole.STORAGE_FACILITY_SUPERVISOR,
  companyId: testNewStorageFacilityCompany.id,
};

export const testCourier: User = {
  id: '8bd959d2-1a9b-4597-af6b-869a30d4a792',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test_courier@test.com',
  username: 'test_courier',
  password: 'test',
  currentHashedRefreshToken: undefined,
  role: UserRole.COURIER,
  companyId: testStorageFacilityCompany.id,
};

export const testManufacturer: User = {
  id: '43e1f6d5-34b8-4870-85b1-8fc66d14f4c4',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test_manufacturer@test.com',
  username: 'test_manufacturer',
  password: 'test',
  currentHashedRefreshToken: undefined,
  role: UserRole.MANUFACTURER_SUPERVISOR,
  companyId: testManufacturerCompany.id,
};

export const testRetailer: User = {
  id: '959f23ef-21ee-42e9-a28e-c8899d417286',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test_retailer@test.com',
  username: 'test_retailer',
  password: 'test',
  currentHashedRefreshToken: undefined,
  role: UserRole.RETAILER_SUPERVISOR,
  companyId: testRetailerCompany.id,
};

@Injectable()
export class UserTestDataService {
  private readonly logger = new CustomLogger(UserTestDataService.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING USER TEST DATA');

    const foundCustomer = await this.prismaService.user.findUnique({
      where: { id: testCustomer.id },
    });
    const foundSupplier = await this.prismaService.user.findUnique({
      where: { id: testSupplier.id },
    });
    const foundStorageFacility = await this.prismaService.user.findUnique({
      where: { id: testStorageFacility.id },
    });
    const foundNewStorageFacility = await this.prismaService.user.findUnique({
      where: { id: testNewStorageFacility.id },
    });
    const foundCourier = await this.prismaService.user.findUnique({
      where: { id: testCourier.id },
    });
    const foundManufacturer = await this.prismaService.user.findUnique({
      where: { id: testManufacturer.id },
    });
    const foundRetailer = await this.prismaService.user.findUnique({
      where: { id: testRetailer.id },
    });

    if (!foundCustomer) {
      this.logger.log('GENERATING TEST CUSTOMER');
      await this.createUser(testCustomer);
    }
    if (!foundSupplier) {
      this.logger.log('GENERATING TEST SUPPLIER');
      await this.createUser(testSupplier);
    }
    if (!foundStorageFacility) {
      this.logger.log('GENERATING TEST STORAGE_FACILITY');
      await this.createUser(testStorageFacility);
    }
    if (!foundNewStorageFacility) {
      this.logger.log('GENERATING TEST NEW STORAGE_FACILITY');
      await this.createUser(testNewStorageFacility);
    }
    if (!foundCourier) {
      this.logger.log('GENERATING TEST COURIER');
      await this.createUser(testCourier);
    }
    if (!foundManufacturer) {
      this.logger.log('GENERATING TEST MANUFACTURER');
      await this.createUser(testManufacturer);
    }
    if (!foundRetailer) {
      this.logger.log('GENERATING TEST RETAILER');
      await this.createUser(testRetailer);
    }

    this.logger.log('DONE GENERATING USER TEST DATA');
  }

  private async createUser(user: User) {
    await this.prismaService.user.create({
      data: { ...user, password: await bcrypt.hash(user.password, 10) },
    });
  }
}
