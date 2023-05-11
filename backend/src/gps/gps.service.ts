import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../shared/custom-logger';
import { ProductItemLocationDTO } from './dto/product-item-location.dto';
import { GpsGateway } from './gps.gateway';

@Injectable()
export class GpsService {
  private readonly logger = new CustomLogger(GpsService.name);
  private counter = 1;

  constructor(private readonly gpsGateway: GpsGateway) {}

  public async updateProductItemLocation(
    dto: ProductItemLocationDTO
  ): Promise<void> {
    this.logger.log(`RFID ${this.counter++}: ${this.convertToHex(dto.rfid)}`);

    this.logger.log(`Latitude: ${dto.latitude}`);
    this.logger.log(`Longitude: ${dto.longitude}`);

    if (dto.latitude === 0 || dto.longitude === 0) {
      return;
    }

    this.gpsGateway.server.emit('test', dto);
  }

  private convertToHex(text: string) {
    return Number.parseInt(text, 10).toString(16).toUpperCase();
  }
}
