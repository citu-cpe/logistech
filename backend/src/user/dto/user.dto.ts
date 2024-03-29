import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CompanyDTO } from '../../company/dto/company.dto';

export enum UserRoleEnum {
  CUSTOMER = 'CUSTOMER',
  SUPPLIER_PACKAGING_PERSONNEL = 'SUPPLIER_PACKAGING_PERSONNEL',
  SUPPLIER_SALES_IN_CHARGE = 'SUPPLIER_SALES_IN_CHARGE',
  SUPPLIER_LOGISTICS_IN_CHARGE = 'SUPPLIER_LOGISTICS_IN_CHARGE',
  SUPPLIER_SUPERVISOR = 'SUPPLIER_SUPERVISOR',
  STORAGE_FACILITY_COURIER_PERSONNEL = 'STORAGE_FACILITY_COURIER_PERSONNEL',
  STORAGE_FACILITY_LOGISTICS_IN_CHARGE = 'STORAGE_FACILITY_LOGISTICS_IN_CHARGE',
  STORAGE_FACILITY_SUPERVISOR = 'STORAGE_FACILITY_SUPERVISOR',
  MANUFACTURER_PACKAGING_PERSONNEL = 'MANUFACTURER_PACKAGING_PERSONNEL',
  MANUFACTURER_SALES_IN_CHARGE = 'MANUFACTURER_SALES_IN_CHARGE',
  MANUFACTURER_LOGISTICS_IN_CHARGE = 'MANUFACTURER_LOGISTICS_IN_CHARGE',
  MANUFACTURER_COURIER_PERSONNEL = 'MANUFACTURER_COURIER_PERSONNEL',
  MANUFACTURER_SUPERVISOR = 'MANUFACTURER_SUPERVISOR',
  COURIER = 'COURIER',
  RETAILER_SUPERVISOR = 'RETAILER_SUPERVISOR',
}

export class UserDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsNumber()
  @IsOptional()
  public addressLatitude?: number;

  @IsNumber()
  @IsOptional()
  public addressLongitude?: number;

  @IsOptional()
  @ValidateNested()
  public company?: CompanyDTO;

  @IsEnum(UserRoleEnum)
  public role: UserRoleEnum;

  @IsOptional()
  @IsUrl()
  public imageUrl?: string;
}
