import {
  IsUUID,
  IsDateString,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { CompanyDTO } from '../../company/dto/company.dto';
import { PaymentDTO } from '../../payment/dto/payment.dto';
import { UserDTO } from '../../user/dto/user.dto';
import { OrderItemDTO } from './order-item.dto';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  INVOICED = 'INVOICED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  BILLED = 'BILLED',
  REJECTED = 'REJECTED',
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

  @IsNumber()
  public invoiceNumber: number;

  @IsBoolean()
  public finalized: boolean;

  @ValidateNested()
  public orderItems: OrderItemDTO[];

  @ValidateNested()
  public fromCompany?: CompanyDTO;

  @ValidateNested()
  public toCompany?: CompanyDTO;

  @ValidateNested()
  public storageFacility?: CompanyDTO;

  @ValidateNested()
  public courier?: UserDTO;

  @ValidateNested({ each: true })
  public payments?: PaymentDTO[];

  @IsOptional()
  @IsDateString()
  public dueDate?: Date;

  @IsOptional()
  @IsNumber()
  public shippingFee?: number;

  @IsNumber()
  public remainingBalance: number;

  @IsOptional()
  @ValidateNested()
  public customer?: UserDTO;
}
