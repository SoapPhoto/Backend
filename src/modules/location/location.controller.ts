import {
  Controller, Inject, forwardRef, Get, Param, Query,
} from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { MapboxService } from '@server/shared/mapbox/mapbox.service';
import { LocationClientType } from '@common/enum/location';
import { LocationService } from './location.service';
import { Role } from '../user/enum/role.enum';

@Controller('api/location')
export class LocationController {
  constructor(
    @Inject(forwardRef(() => LocationService))
    private readonly locationService: LocationService,
    @Inject(forwardRef(() => MapboxService))
    private readonly mapboxService: MapboxService,
  ) {}

  @Get('search/:search')
  @Roles(Role.USER)
  public async searchPlace(
    @Param('search') value: string,
      @Query('clientType') type = LocationClientType.BAIDU,
  ) {
    if (type === LocationClientType.BAIDU) {
      return this.locationService.search(value);
    }
    return this.mapboxService.forwardGeocode(value);
  }

  @Get('reverse/geocoding')
  public async reverseGeocoding(
    @Query('location') location: string,
  ) {
    return this.locationService.reverseGeocoding(location);
  }
}
