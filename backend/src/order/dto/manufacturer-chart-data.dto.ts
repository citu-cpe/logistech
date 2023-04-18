import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ManufacturerChartDataDTO {
  @IsString()
  @IsNotEmpty()
  public date: string;

  @IsNumber()
  public ordered: number;

  @IsNumber()
  public manufactured: number;

  @IsNumber()
  public sold: number;
}
