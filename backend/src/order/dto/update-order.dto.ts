import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { OrderStatusEnum } from './order.dto';

export class UpdateOrderDTO {
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  public status?: OrderStatusEnum;

  @IsOptional()
  @IsUUID()
  public storageFacilityId?: string;

  @IsOptional()
  @IsUUID()
  public courierId?: string;

  @IsOptional()
  @IsDateString()
  public dueDate?: Date;

  @IsOptional()
  @IsNumber()
  public shippingFee?: number;
}
