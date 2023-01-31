import { IsDateString, IsUUID, ValidateNested } from 'class-validator';
import { CompanyDTO } from '../../company/dto/company.dto';
import { ProductItemDTO } from '../../product/dto/product-item.dto';

export class TransactionDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @ValidateNested({ each: true })
  public productItems: ProductItemDTO[];

  @ValidateNested()
  public sendingCompany?: CompanyDTO;

  @ValidateNested()
  public receivingCompany?: CompanyDTO;
}
