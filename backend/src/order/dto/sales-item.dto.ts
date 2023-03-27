import { ValidateNested } from 'class-validator';
import { CompanyDTO } from '../../company/dto/company.dto';
import { OrderItemDTO } from './order-item.dto';

export class SalesItemDTO {
  @ValidateNested()
  public customer: CompanyDTO;

  @ValidateNested({ each: true })
  public orderItems: OrderItemDTO[];
}
