import {
  IsUUID,
  IsDateString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { OrderDTO } from '../../order/dto/order.dto';

export class PaymentDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @IsNumber()
  public amount: number;

  @IsOptional()
  @ValidateNested()
  public order?: OrderDTO;

  @IsUUID()
  public orderId: string;
}
