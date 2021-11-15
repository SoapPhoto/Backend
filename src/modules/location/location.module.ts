import { Module } from '@nestjs/common';

import { MapboxModule } from '@server/shared/mapbox/mapbox.module';
import { BaiduModule } from '@server/shared/baidu/baidu.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationResolver } from './location.resolver';
import { LocationEntity } from './location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationEntity]),
    MapboxModule,
    BaiduModule,
  ],
  providers: [LocationService, LocationResolver, LocationService],
  exports: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
