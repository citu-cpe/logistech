import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductItemLocationDTO {
  @IsString()
  @IsNotEmpty()
  public rfid: string;

  @IsOptional()
  @IsNumber()
  public latitude: number;

  @IsOptional()
  @IsNumber()
  public longitude: number;

  @IsOptional()
  @IsString()
  public missingTags: string;
}
