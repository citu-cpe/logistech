import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { OrderItemDTO } from './order-item.dto';

export class CreateOrderFromOrderItemsDTO {
  @IsArray()
  @ValidateNested({ each: true })
  public orderItems: OrderItemDTO[];

  @IsUUID()
  public owningCompanyId: string;
}
