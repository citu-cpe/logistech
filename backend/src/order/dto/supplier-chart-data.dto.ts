import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SupplierChartDataDTO {
  @IsString()
  @IsNotEmpty()
  public date: string;

  @IsNumber()
  public sales: number;
}
