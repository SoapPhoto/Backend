import {
  Controller, Inject, forwardRef, Get, Param, Query,
} from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { LocationService } from './location.service';
import { Role } from '../user/enum/role.enum';

@Controller('api/location')
export class LocationController {
  constructor(
    @Inject(forwardRef(() => LocationService))
    private readonly locationService: LocationService,
  ) {}

  @Get('search/:search')
  @Roles(Role.USER)
  public async searchPlace(
    @Param('search') value: string,
  ) {
    return this.locationService.search(value);
  }

  @Get('reverse/geocoding')
  public async reverseGeocoding(
    @Query('location') location: string,
  ) {
    return this.locationService.reverseGeocoding(location);
  }
}
