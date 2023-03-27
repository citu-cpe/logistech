import { IsArray, ValidateNested } from 'class-validator';
import { ProductDTO } from '../../product/dto/product.dto';
import { SalesItemDTO } from './sales-item.dto';

export class SalesDTO {
  @ValidateNested()
  public product: ProductDTO;

  @IsArray()
  @ValidateNested({ each: true })
  public salesItems: SalesItemDTO[];
}
