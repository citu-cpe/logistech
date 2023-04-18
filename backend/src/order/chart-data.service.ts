import { Injectable } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { SupplierChartDataDTO } from './dto/supplier-chart-data.dto';
import moment from 'moment';
import { ManufacturerChartDataDTO } from './dto/manufacturer-chart-data.dto';
import { OrderStatus, ProductItemStatus } from '@prisma/client';
import { RetailerChartDataDTO } from './dto/retailer-chart-data.dto';
import { OrderStatusEnum } from './dto/order.dto';
import { StorageFacilityChartDataDTO } from './dto/storage-facility-chart-data.dto';

@Injectable()
export class ChartDataService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getSupplierChartData(companyId: string) {
    const sales: SupplierChartDataDTO[] = [];

    const endDate = moment();
    const startDate = moment().subtract(12, 'month');

    while (endDate.diff(startDate, 'months') >= 0) {
      const startOfMonth = moment(startDate).startOf('month');
      const endOfMonth = moment(startDate).endOf('month');

      const salesForMonth = await this.prismaService.order.findMany({
        where: {
          toCompanyId: companyId,
          paidAt: {
            gte: new Date(startOfMonth.format('YYYY-MM-DD')),
            lte: new Date(endOfMonth.format('YYYY-MM-DD')),
          },
        },
        select: { total: true },
      });

      const sumSales = salesForMonth.reduce(
        (sum: number, s) => s.total + sum,
        0
      );

      sales.push({
        date: startOfMonth.format('MM/YY'),
        sales: sumSales,
      });
      startDate.add(1, 'month');
    }

    return sales;
  }

  public async getManufacturerChartData(companyId: string) {
    const manufacturerChartData: ManufacturerChartDataDTO[] = [];

    const endDate = moment();
    const startDate = moment().subtract(2, 'month');

    while (endDate.diff(startDate, 'months') >= 0) {
      const startOfMonth = moment(startDate).startOf('month');
      const endOfMonth = moment(startDate).endOf('month');

      const productItemStatuses = await this.prismaService.productItem.groupBy({
        by: ['status'],
        where: {
          product: { companyId },
          updatedAt: {
            gte: new Date(startOfMonth.format('YYYY-MM-DD')),
            lte: new Date(endOfMonth.format('YYYY-MM-DD')),
          },
        },
        _count: { id: true },
      });

      const onHold = productItemStatuses.find(
        (p) => p.status === ProductItemStatus.ON_HOLD
      );

      const complete = productItemStatuses.find(
        (p) => p.status === ProductItemStatus.COMPLETE
      );

      const inStorage = productItemStatuses.find(
        (p) => p.status === ProductItemStatus.IN_STORAGE
      );

      manufacturerChartData.push({
        date: startOfMonth.format('MM/YY'),
        ordered: onHold?._count.id ?? 0,
        sold: complete?._count.id ?? 0,
        manufactured: inStorage?._count.id ?? 0,
      });

      startDate.add(1, 'month');
    }

    return manufacturerChartData;
  }

  public async getRetailerChartData(companyId: string) {
    const retailerChartData: RetailerChartDataDTO[] = [];

    const endDate = moment();
    const startDate = moment().subtract(5, 'month');

    while (endDate.diff(startDate, 'months') >= 0) {
      const startOfMonth = moment(startDate).startOf('month');
      const endOfMonth = moment(startDate).endOf('month');

      const outgoingPaidOrders = await this.prismaService.order.findMany({
        where: {
          fromCompanyId: companyId,
          status: OrderStatusEnum.PAID,
          paidAt: {
            gte: new Date(startOfMonth.format('YYYY-MM-DD')),
            lte: new Date(endOfMonth.format('YYYY-MM-DD')),
          },
        },
        select: { total: true },
      });

      const incomingPaidOrders = await this.prismaService.order.findMany({
        where: {
          toCompanyId: companyId,
          status: OrderStatusEnum.PAID,
          paidAt: {
            gte: new Date(startOfMonth.format('YYYY-MM-DD')),
            lte: new Date(endOfMonth.format('YYYY-MM-DD')),
          },
        },
        select: { total: true },
      });

      const cost = outgoingPaidOrders.reduce((sum, o) => sum + o.total, 0);
      const profit = incomingPaidOrders.reduce((sum, o) => sum + o.total, 0);

      retailerChartData.push({
        date: startOfMonth.format('MM/YY'),
        profit,
        cost,
      });

      startDate.add(1, 'month');
    }

    return retailerChartData;
  }

  public async getStorageFacilityChartData(companyId: string) {
    const storageFacilityChartData: StorageFacilityChartDataDTO[] = [];

    const endDate = moment();
    const startDate = moment().subtract(5, 'month');

    while (endDate.diff(startDate, 'months') >= 0) {
      const startOfMonth = moment(startDate).startOf('month');
      const endOfMonth = moment(startDate).endOf('month');

      const storedOrders = await this.prismaService.order.findMany({
        where: {
          storageFacilityId: companyId,
          status: OrderStatus.BILLED,
          updatedAt: {
            gte: new Date(startOfMonth.format('YYYY-MM-DD')),
            lte: new Date(endOfMonth.format('YYYY-MM-DD')),
          },
        },
      });
      const shippedOrders = await this.prismaService.order.findMany({
        where: {
          storageFacilityId: companyId,
          orderItems: {
            every: {
              productItems: { every: { status: ProductItemStatus.COMPLETE } },
            },
          },
          updatedAt: {
            gte: new Date(startOfMonth.format('YYYY-MM-DD')),
            lte: new Date(endOfMonth.format('YYYY-MM-DD')),
          },
        },
      });

      storageFacilityChartData.push({
        date: startOfMonth.format('MM/YY'),
        shipped: shippedOrders.length,
        stored: storedOrders.length,
      });

      startDate.add(1, 'month');
    }

    return storageFacilityChartData;
  }
}
