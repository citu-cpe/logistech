import { OrderStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOrderDTO {
  @IsOptional()
  @IsEnum(OrderStatus)
  public status?: OrderStatus;

  @IsNumber()
  public total: number;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public orderItemIds: string[];

  @IsUUID()
  public companyId: string;
}
