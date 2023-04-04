import {
  IsUUID,
  IsDateString,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ProductItemDTO } from '../..//product/dto/product-item.dto';
import { UserDTO } from '../../user/dto/user.dto';

export class ReportDTO {
  @IsUUID()
  public id: string;

  @IsDateString()
  public createdAt: Date;

  @IsDateString()
  public updatedAt: Date;

  @ValidateNested()
  public reportedBy: UserDTO;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @ValidateNested()
  public productItem: ProductItemDTO;
}
