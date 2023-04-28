import { Module } from '@nestjs/common';
import { GpsController } from './gps.controller';
import { GpsGateway } from './gps.gateway';
import { GpsService } from './gps.service';

@Module({
  providers: [GpsGateway, GpsService],
  controllers: [GpsController],
  exports: [GpsGateway, GpsService],
})
export class GpsModule {}
