import { Module } from '@nestjs/common';
import { ChartDataService } from './chart-data.service';
import { OrderItemService } from './order-item.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  providers: [OrderService, OrderItemService, ChartDataService],
  exports: [OrderService, OrderItemService],
  controllers: [OrderController],
})
export class OrderModule {}
