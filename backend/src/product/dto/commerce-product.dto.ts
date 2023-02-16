import { IsEnum } from 'class-validator';
import { CompanyTypeEnum } from '../../company/dto/company.dto';

export class CommerceProductDTO {
  @IsEnum(CompanyTypeEnum, { each: true })
  public companyTypes: CompanyTypeEnum[];
}
