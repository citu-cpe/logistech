import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  public price: number;

  @IsBoolean()
  public bulk: boolean;

  @IsNumber()
  @Min(1)
  @IsOptional()
  public bulkQuantity?: number;
}
