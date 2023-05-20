import { IsNotEmpty, IsString } from 'class-validator';

export class AssignRfidToProductItemDTO {
  @IsString()
  @IsNotEmpty()
  public rfid: string;
}
