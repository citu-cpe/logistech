import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ProductItemStatusEnum } from './product-item.dto';

export class CreateProductItemDTO {
  @IsString()
  @IsOptional()
  public rfid?: string;

  @IsEnum(ProductItemStatusEnum)
  public status: ProductItemStatusEnum;
}
