import { ValidateNested } from 'class-validator';
import { ProductItemDTO } from './product-item.dto';

export class CourierProductItemsDTO {
  @ValidateNested({ each: true })
  public inTransitToStorageFacilityProductItems: ProductItemDTO[];

  @ValidateNested({ each: true })
  public inStorageFacilityProductItems: ProductItemDTO[];

  @ValidateNested({ each: true })
  public inTransitToBuyerProductItems: ProductItemDTO[];

  @ValidateNested({ each: true })
  public toBePickedUpProductItems: ProductItemDTO[];

  @ValidateNested({ each: true })
  public returnAcceptedProductItems: ProductItemDTO[];

  @ValidateNested({ each: true })
  public inTransitToSellerProductItems: ProductItemDTO[];
}
