import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AddStorageFacilityPartnerDTO } from './dto/add-storage-facility-partner.dto';
import { CompanyDTO } from './dto/company.dto';

@Controller(CompanyController.COMPANY_API_ROUTE)
export class CompanyController {
  public static readonly COMPANY_API_ROUTE = '/company';
  public static readonly STORAGE_FACILITY_PARTNERS_API_ROUTE =
    '/:id/storage-facility/partners';
  public static readonly REMOVE_STORAGE_FACILITY_PARTNER_API_ROUTE =
    '/:id/storage-facility/partners/:storageFacilityId';
  public static readonly AVAILABLE_STORAGE_FACILITY_PARTNERS_API_ROUTE =
    '/:id/storage-facility/available';
  public static readonly SELLER_PARTNERS_API_ROUTE = '/:id/seller-partners';

  constructor(private readonly companyService: CompanyService) {}

  @Get(CompanyController.STORAGE_FACILITY_PARTNERS_API_ROUTE)
  public getStorageFacilityPartners(
    @Param('id') id: string
  ): Promise<CompanyDTO[]> {
    return this.companyService.getStorageFacilityPartners(id);
  }

  @Get(CompanyController.AVAILABLE_STORAGE_FACILITY_PARTNERS_API_ROUTE)
  public getAvailableStorageFacilities(
    @Param('id') id: string
  ): Promise<CompanyDTO[]> {
    return this.companyService.getAvailableStorageFacilityPartners(id);
  }

  @Get(CompanyController.SELLER_PARTNERS_API_ROUTE)
  public getSellerPartners(@Param('id') id: string): Promise<CompanyDTO[]> {
    return this.companyService.getSellerPartners(id);
  }

  @Post(CompanyController.STORAGE_FACILITY_PARTNERS_API_ROUTE)
  public addStorageFacilityPartners(
    @Param('id') id: string,
    @Body() dto: AddStorageFacilityPartnerDTO
  ): Promise<void> {
    return this.companyService.addStorageFacilityPartners(id, dto);
  }

  @Post(CompanyController.REMOVE_STORAGE_FACILITY_PARTNER_API_ROUTE)
  public removeStorageFacilityPartner(
    @Param('id') id: string,
    @Param('storageFacilityId') storageFacilityId: string
  ): Promise<void> {
    return this.companyService.removeStorageFacilityPartner(
      id,
      storageFacilityId
    );
  }
}
