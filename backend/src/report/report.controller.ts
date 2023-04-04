import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { CreateReportDTO } from './dto/create-report.dto';
import { ReportDTO } from './dto/report.dto';
import { ReportService } from './report.service';

@Controller(ReportController.REPORT_API_ROUTE)
export class ReportController {
  public static readonly REPORT_API_ROUTE = '/report';
  public static readonly COMPANY_API_ROUTE = '/company/:companyId';

  constructor(private readonly reportService: ReportService) {}

  @Get(ReportController.COMPANY_API_ROUTE)
  public getReports(
    @Param('companyId') companyId: string
  ): Promise<ReportDTO[]> {
    return this.reportService.getReports(companyId);
  }

  @Post()
  public createReport(
    @Body() dto: CreateReportDTO,
    @Req() { user }: RequestWithUser
  ) {
    return this.reportService.createReport(dto, user);
  }
}
