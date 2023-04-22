import { IsEnum } from 'class-validator';
import { ProductItemStatusEnum } from './product-item.dto';

export class UpdateProductItemStatusDTO {
  @IsEnum(ProductItemStatusEnum)
  public status: ProductItemStatusEnum;
}
