import { IsEnum } from 'class-validator';
import { OrderStatusEnum } from './order.dto';

export class UpdateOrderStatusDTO {
  @IsEnum(OrderStatusEnum)
  public status: OrderStatusEnum;
}
