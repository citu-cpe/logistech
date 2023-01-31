import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export enum CompanyTypeEnum {
  STORAGE_FACILITY = 'STORAGE_FACILITY',
  COURIER = 'COURIER',
  SUPPLIER = 'SUPPLIER',
  MANUFACTURER = 'MANUFACTURER',
  RETAILER = 'RETAILER',
}

export class CompanyDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @IsEnum(CompanyTypeEnum)
  public type: CompanyTypeEnum;

  @IsString()
  @IsNotEmpty()
  public name: string;
}
