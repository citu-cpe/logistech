import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [OrderModule],
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
