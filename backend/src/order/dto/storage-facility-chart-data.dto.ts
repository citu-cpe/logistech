import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class StorageFacilityChartDataDTO {
  @IsString()
  @IsNotEmpty()
  public date: string;

  @IsNumber()
  public shipped: number;

  @IsNumber()
  public stored: number;
}
