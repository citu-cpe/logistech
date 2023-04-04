import { Injectable } from '@nestjs/common';
import { Product, ProductItem, Report, User } from '@prisma/client';
import { PrismaService } from '../global/prisma/prisma.service';
import { ProductItemService } from '../product/product-item.service';
import { UserService } from '../user/user.service';
import { CreateReportDTO } from './dto/create-report.dto';
import { ReportDTO } from './dto/report.dto';

@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getReports(companyId: string) {
    const reports = await this.prismaService.report.findMany({
      where: { productItem: { product: { companyId } } },
      include: {
        productItem: { include: { product: true } },
        reportedBy: true,
      },
    });

    return reports.map((r) => ReportService.convertToDTO(r));
  }

  public async createReport(dto: CreateReportDTO, user: User) {
    await this.prismaService.report.create({
      data: {
        description: dto.description,
        reportedBy: { connect: { id: user.id } },
        productItem: { connect: { id: dto.productItemId } },
      },
    });
  }

  public static convertToDTO(
    report: Report & {
      reportedBy?: User;
      productItem?: ProductItem & { product?: Product };
    }
  ): ReportDTO {
    return {
      ...report,
      reportedBy:
        report.reportedBy && UserService.convertToDTO(report.reportedBy),
      productItem:
        report.productItem &&
        ProductItemService.convertToDTO(report.productItem),
    };
  }
}
