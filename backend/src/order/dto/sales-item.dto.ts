import { IsOptional, ValidateNested } from 'class-validator';
import { CompanyDTO } from '../../company/dto/company.dto';
import { UserDTO } from '../../user/dto/user.dto';
import { OrderItemDTO } from './order-item.dto';

export class SalesItemDTO {
  @IsOptional()
  @ValidateNested()
  public customer?: CompanyDTO;

  @IsOptional()
  @ValidateNested()
  public user?: UserDTO;

  @ValidateNested({ each: true })
  public orderItems: OrderItemDTO[];
}
