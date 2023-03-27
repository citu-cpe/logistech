import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export enum CompanyTypeEnum {
  STORAGE_FACILITY = 'STORAGE_FACILITY',
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

  @IsString()
  public address: string;

  @IsString()
  @IsPhoneNumber()
  public contactNumber: string;

  @IsString()
  @IsEmail()
  public email: string;
}
