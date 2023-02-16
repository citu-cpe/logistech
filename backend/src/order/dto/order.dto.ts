import {
  IsUUID,
  IsDateString,
  IsEnum,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { CompanyDTO } from '../../company/dto/company.dto';
import { OrderItemDTO } from './order-item.dto';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  INVOICED = 'INVOICED',
  PAID = 'PAID',
}

export class OrderDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @IsEnum(OrderStatusEnum)
  public status: OrderStatusEnum;

  @IsNumber()
  public total: number;

  @ValidateNested()
  public orderItems: OrderItemDTO[];

  @ValidateNested()
  public fromCompany?: CompanyDTO;

  @ValidateNested()
  public toCompany?: CompanyDTO;
}
