import {
  IsUUID,
  IsDateString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { CompanyDTO } from '../../company/dto/company.dto';
import { OrderItemDTO } from '../../order/dto/order-item.dto';

export class OrderItemGroup {
  public company: CompanyDTO;
  public orderItems: OrderItemDTO[];
  public total: number;
}

export class CartDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @IsNumber()
  public total: number;

  @IsOptional()
  @ValidateNested()
  public company?: CompanyDTO;

  public groupedOrderItems: OrderItemGroup[];
}
