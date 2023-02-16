import { Injectable } from '@nestjs/common';
import { Company } from '@prisma/client';
import { CompanyDTO, CompanyTypeEnum } from './dto/company.dto';

@Injectable()
export class CompanyService {
  public static convertToDTO(company: Company): CompanyDTO {
    return {
      ...company,
      type: company.type as CompanyTypeEnum,
    };
  }
}
