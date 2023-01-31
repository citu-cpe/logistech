import { ValidateNested } from 'class-validator';
import { CreateProductItemDTO } from './create-product-item.dto';

export class CreateManyProductItemsDTO {
  @ValidateNested({ each: true })
  public productItems: CreateProductItemDTO[];
}
