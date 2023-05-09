import { IsUUID, IsNumber, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreatePaymentDTO {
  @IsNumber()
  @Min(50)
  public amount: number;

  @IsUUID()
  public orderId: string;

  @IsBoolean()
  @IsOptional()
  public isMobile?: boolean;
}
