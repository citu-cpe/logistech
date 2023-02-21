import { Injectable } from '@nestjs/common';
import { Company, CompanyType, UserRole } from '@prisma/client';
import { PrismaService } from '../global/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AddStorageFacilityPartnerDTO } from './dto/add-storage-facility-partner.dto';
import { CompanyDTO, CompanyTypeEnum } from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getStorageFacilityPartners(id: string) {
    const storageFacilityPartners = await this.prismaService.company.findMany({
      where: {
        type: CompanyType.STORAGE_FACILITY,
        sellerPartners: { some: { id } },
      },
    });

    return storageFacilityPartners.map((s) => CompanyService.convertToDTO(s));
  }

  public async getAvailableStorageFacilityPartners(id: string) {
    const storageFacilityPartners = await this.prismaService.company.findMany({
      where: {
        type: CompanyType.STORAGE_FACILITY,
        sellerPartners: { none: { id } },
      },
    });

    return storageFacilityPartners.map((s) => CompanyService.convertToDTO(s));
  }

  public async getSellerPartners(id: string) {
    const sellerPartners = await this.prismaService.company.findMany({
      where: {
        type: {
          in: [
            CompanyType.SUPPLIER,
            CompanyType.MANUFACTURER,
            CompanyType.RETAILER,
          ],
        },
        storageFacilityPartners: { some: { id } },
      },
    });

    return sellerPartners.map((s) => CompanyService.convertToDTO(s));
  }

  public async addStorageFacilityPartners(
    id: string,
    dto: AddStorageFacilityPartnerDTO
  ) {
    const storageFacilityPartners = dto.storageFacilityIds.map((sId) => ({
      id: sId,
    }));

    await this.prismaService.company.update({
      where: { id },
      data: {
        storageFacilityPartners: {
          connect: storageFacilityPartners,
        },
      },
    });
  }

  public async removeStorageFacilityPartner(
    id: string,
    storageFacilityId: string
  ) {
    await this.prismaService.company.update({
      where: { id },
      data: {
        storageFacilityPartners: {
          disconnect: { id: storageFacilityId },
        },
      },
    });
  }

  public async getCouriers(id: string) {
    const couriers = await this.prismaService.user.findMany({
      where: { companyId: id, role: UserRole.COURIER },
    });

    return couriers.map((c) => UserService.convertToDTO(c));
  }

  public static convertToDTO(company: Company): CompanyDTO {
    return {
      ...company,
      type: company.type as CompanyTypeEnum,
    };
  }
}
