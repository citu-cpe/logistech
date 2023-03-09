import { IsUrl } from 'class-validator';

export class PaymentUrlDTO {
  @IsUrl()
  public url: string;
}
