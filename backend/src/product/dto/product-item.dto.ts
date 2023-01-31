import {
  IsUUID,
  IsDateString,
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ProductDTO } from './product.dto';

export enum ProductItemStatusEnum {
  IN_STORAGE = 'IN_STORAGE',
  TO_BE_PICKED_UP = 'TO_BE_PICKED_UP',
  ON_HOLD = 'ON_HOLD',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETE = 'COMPLETE',
  CANCELED = 'CANCELED',
  RED_FLAG = 'RED_FLAG',
}

export class ProductItemDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @IsString()
  @IsNotEmpty()
  public rfid: string;

  @IsEnum(ProductItemStatusEnum)
  public status: ProductItemStatusEnum;

  @IsOptional()
  @ValidateNested()
  public product?: ProductDTO;
}
