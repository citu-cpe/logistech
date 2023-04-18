import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class RetailerChartDataDTO {
  @IsString()
  @IsNotEmpty()
  public date: string;

  @IsNumber()
  public cost: number;

  @IsNumber()
  public profit: number;
}
