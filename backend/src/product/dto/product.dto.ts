import {
  IsUUID,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
  IsBoolean,
  Min,
  IsOptional,
} from 'class-validator';
import { CompanyDTO } from '../../company/dto/company.dto';

export class ProductDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  public price: number;

  @IsNumber()
  public numInStock: number;

  @IsBoolean()
  public bulk: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  public bulkQuantity?: number;

  @IsOptional()
  @ValidateNested()
  public company?: CompanyDTO;
}
