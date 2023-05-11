import { IsNotEmpty, IsString } from 'class-validator';

export class ProductItemLocationDTO {
  @IsString()
  @IsNotEmpty()
  public rfid: string;

  public latitude: number;

  public longitude: number;
}
