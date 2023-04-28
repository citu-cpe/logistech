import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductItemLocationDTO {
  @IsString()
  @IsNotEmpty()
  public rfid: string;

  @IsNumber()
  public latitude: number;

  @IsNumber()
  public longitude: number;
}
