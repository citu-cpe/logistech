import { IsUUID, ValidateNested } from 'class-validator';
import { ProductItemDTO } from '../../product/dto/product-item.dto';

export class CreateTransactionDTO {
  @ValidateNested({ each: true })
  public productItems: ProductItemDTO[];

  @IsUUID()
  public sendingCompanyId: string;

  @IsUUID()
  public receivingCompanyId: string;
}
