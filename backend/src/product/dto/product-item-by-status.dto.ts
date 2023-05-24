import { IsArray, IsEnum } from 'class-validator';
import { ProductItemStatusEnum } from './product-item.dto';

export class ProductItemByStatusDTO {
  @IsEnum(ProductItemStatusEnum, { each: true })
  @IsArray()
  public status: ProductItemStatusEnum[];
}
