import { IsEnum } from 'class-validator';
import { ProductItemStatusEnum } from './product-item.dto';

export class ProductItemByStatusDTO {
  @IsEnum(ProductItemStatusEnum)
  public status: ProductItemStatusEnum;
}
