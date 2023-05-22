import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ProductItemStatusEnum } from './product-item.dto';

export class CreateProductItemDTO {
  @IsString()
  @IsOptional()
  public rfid?: string;

  @IsEnum(ProductItemStatusEnum)
  public status: ProductItemStatusEnum;

  @IsOptional()
  @IsUUID()
  public courierId?: string;
}
