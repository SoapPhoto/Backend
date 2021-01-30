import { Resolver, Query, Args } from '@nestjs/graphql';
import { forwardRef, Inject } from '@nestjs/common';
import { LocationService } from './location.service';

@Resolver('Location')
export class LocationResolver {
  constructor(
    @Inject(forwardRef(() => LocationService))
    private readonly locationService: LocationService,
  ) {}

  @Query()
  public async searchPlace(
    @Args('value') value: string,
    @Args('region') region: string,
  ) {
    return this.locationService.search(region, value);
  }

  @Query()
  public async reverseGeocoding(
    @Args('location') location: string,
  ) {
    return this.locationService.reverseGeocoding(location);
  }
}
