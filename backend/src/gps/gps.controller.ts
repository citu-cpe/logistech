import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../shared/decorators/public.decorator';
import { ProductItemLocationDTO } from './dto/product-item-location.dto';
import { GpsService } from './gps.service';

@Controller(GpsController.GPS_API_ROUTE)
export class GpsController {
  public static readonly GPS_API_ROUTE = '/gps';
  public static readonly PRODUCT_ITEM_API_ROUTE = '/product-item';

  constructor(private readonly gpsService: GpsService) {}

  @Public()
  @Post(GpsController.PRODUCT_ITEM_API_ROUTE)
  public updateProductItemLocation(
    @Body() dto: ProductItemLocationDTO
  ): Promise<void> {
    return this.gpsService.updateProductItemLocation(dto);
  }
}
