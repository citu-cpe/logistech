import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  providers: [ReportService],
  exports: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
