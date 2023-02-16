import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  providers: [OrderService, OrderItemService],
  exports: [OrderService, OrderItemService],
  controllers: [OrderController],
})
export class OrderModule {}
