import { IsUUID, IsNumber } from 'class-validator';

export class CreatePaymentDTO {
  @IsNumber()
  public amount: number;

  @IsUUID()
  public orderId: string;
}
