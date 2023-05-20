import { IsNotEmpty, IsString } from 'class-validator';

export class ScanRfidDTO {
  @IsString()
  @IsNotEmpty()
  public rfid: string;
}
