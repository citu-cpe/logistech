import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreatePaymentDTO {
  @IsNumber()
  @Min(50)
  public amount: number;

  @IsUUID()
  public orderId: string;
}
