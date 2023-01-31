import { Module } from '@nestjs/common';
import { ProductItemService } from './product-item.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  providers: [ProductService, ProductItemService],
  exports: [ProductService, ProductItemService],
  controllers: [ProductController],
})
export class ProductModule {}
