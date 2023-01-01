import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export enum RoleEnum {
  STORAGE_FACILITY = 'STORAGE_FACILITY',
  COURIER = 'COURIER',
  SUPPLIER = 'SUPPLIER',
  MANUFACTURER = 'MANUFACTURER',
  RETAILER = 'RETAILER',
  CUSTOMER = 'CUSTOMER',
}

export class UserDTO {
  @IsString()
  @IsNotEmpty()
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

  @IsEnum(RoleEnum)
  public role: RoleEnum;
}
