import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationResolver } from './location.resolver';

@Module({
  providers: [LocationService, LocationResolver, LocationService],
  exports: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
