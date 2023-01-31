import { Controller } from '@nestjs/common';

@Controller(ReportController.REPORT_API_ROUTE)
export class ReportController {
  public static readonly REPORT_API_ROUTE = '/report';
}
