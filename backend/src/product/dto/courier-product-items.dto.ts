import { ValidateNested } from 'class-validator';
import { ProductItemDTO } from './product-item.dto';

export class CourierProductItemsDTO {
  @ValidateNested({ each: true })
  public inTransitProductItems: ProductItemDTO[];

  @ValidateNested({ each: true })
  public toBePickedUpProductItems: ProductItemDTO[];

  @ValidateNested({ each: true })
  public returningProductItems: ProductItemDTO[];
}
