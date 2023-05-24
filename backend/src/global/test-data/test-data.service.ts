import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveProfilesService } from '../active-profiles/active-profiles.service';
import { CompanyTestDataService } from './company-test-data.service';
// import { ProductItemTestDataService } from './product-item-test-data.service';
import { ProductTestDataService } from './product-test-data.service';
import { UserTestDataService } from './user-test-data.service';

@Injectable()
export class TestDataService implements OnModuleInit {
  constructor(
    private readonly userTestDataService: UserTestDataService,
    private readonly companyTestDataService: CompanyTestDataService,
    private readonly productTestDataService: ProductTestDataService,
    // private readonly productItemTestDataService: ProductItemTestDataService,
    private readonly activeProfilesService: ActiveProfilesService
  ) {}

  public async onModuleInit() {
    if (
      this.activeProfilesService.isTestDataProfileActive() ||
      this.activeProfilesService.isTestProfileActive()
    ) {
      await this.generateTestData();
    }
  }

  public async generateTestData() {
    await this.companyTestDataService.generateTestData();
    await this.userTestDataService.generateTestData();
    await this.productTestDataService.generateTestData();
    // await this.productItemTestDataService.generateTestData();
  }
}
