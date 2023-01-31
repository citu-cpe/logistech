import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ProductItemStatusEnum } from './product-item.dto';

export class CreateProductItemDTO {
  @IsString()
  @IsNotEmpty()
  public rfid: string;

  @IsEnum(ProductItemStatusEnum)
  public status: ProductItemStatusEnum;
}
