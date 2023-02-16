import { Module } from '@nestjs/common';
import { CompanyTestDataService } from './company-test-data.service';
import { ProductItemTestDataService } from './product-item-test-data.service';
import { ProductTestDataService } from './product-test-data.service';
import { TestDataService } from './test-data.service';
import { UserTestDataService } from './user-test-data.service';

@Module({
  providers: [
    TestDataService,
    UserTestDataService,
    CompanyTestDataService,
    ProductTestDataService,
    ProductItemTestDataService,
  ],
  exports: [TestDataService],
})
export class TestDataModule {}
