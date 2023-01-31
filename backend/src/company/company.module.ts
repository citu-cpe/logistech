import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';

@Module({
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
