import {
  IsUUID,
  IsDateString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { CartDTO } from 'src/cart/dto/cart.dto';
import { ProductItemDTO } from 'src/product/dto/product-item.dto';
import { ProductDTO } from 'src/product/dto/product.dto';
import { OrderDTO } from './order.dto';

export class OrderItemDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @IsNumber()
  public quantity: number;

  @IsNumber()
  public total: number;

  @IsOptional()
  @ValidateNested()
  public cart?: CartDTO;

  @IsOptional()
  @ValidateNested()
  public order?: OrderDTO;

  @ValidateNested()
  public product: ProductDTO;

  @IsOptional()
  @ValidateNested({ each: true })
  public productItems?: ProductItemDTO[];
}
