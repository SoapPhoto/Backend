import { Module } from '@nestjs/common';

import { MapboxModule } from '@server/shared/mapbox/mapbox.module';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationResolver } from './location.resolver';

@Module({
  imports: [
    MapboxModule,
  ],
  providers: [LocationService, LocationResolver, LocationService],
  exports: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
