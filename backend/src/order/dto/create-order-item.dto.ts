import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderItemDTO {
  @IsNumber()
  public quantity: number;

  @IsUUID()
  public productId: string;

  @IsOptional()
  @IsUUID()
  public cartId?: string;

  @IsOptional()
  @IsUUID()
  public orderId?: string;
}
