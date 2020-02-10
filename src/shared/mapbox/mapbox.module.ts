import { Module } from '@nestjs/common';
import { MapboxService } from './mapbox.service';

@Module({
  providers: [MapboxService],
  exports: [MapboxService],
})
export class MapboxModule {}
