import {
  IsUUID,
  IsDateString,
  IsString,
  IsEnum,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { CompanyDTO } from '../../company/dto/company.dto';
import { UserDTO } from '../../user/dto/user.dto';
import { ProductDTO } from './product.dto';

export enum ProductItemStatusEnum {
  IN_STORAGE = 'IN_STORAGE',
  ON_HOLD = 'ON_HOLD',
  TO_BE_PICKED_UP = 'TO_BE_PICKED_UP',
  IN_TRANSIT_TO_STORAGE_FACILITY = 'IN_TRANSIT_TO_STORAGE_FACILITY',
  IN_STORAGE_FACILITY = 'IN_STORAGE_FACILITY',
  IN_TRANSIT_TO_BUYER = 'IN_TRANSIT_TO_BUYER',
  COMPLETE = 'COMPLETE',
  CANCELED = 'CANCELED',
  RED_FLAG = 'RED_FLAG',
  RETURNING = 'RETURNING',
  RETURNED = 'RETURNED',
}

export class ProductItemDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @IsString()
  @IsOptional()
  public rfid?: string;

  @IsEnum(ProductItemStatusEnum)
  public status: ProductItemStatusEnum;

  @IsOptional()
  @ValidateNested()
  public product?: ProductDTO;

  @IsOptional()
  @ValidateNested()
  public customer?: UserDTO;

  @IsOptional()
  @ValidateNested()
  public courier?: UserDTO;

  @IsOptional()
  @ValidateNested()
  public buyer?: CompanyDTO;
}
