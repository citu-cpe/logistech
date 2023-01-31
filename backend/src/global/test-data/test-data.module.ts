import { Module } from '@nestjs/common';
import { CompanyTestDataService } from './company-test-data.service';
import { TestDataService } from './test-data.service';
import { UserTestDataService } from './user-test-data.service';

@Module({
  providers: [TestDataService, UserTestDataService, CompanyTestDataService],
  exports: [TestDataService],
})
export class TestDataModule {}
