import { Resolver, Query, Args } from '@nestjs/graphql';
import { forwardRef, Inject } from '@nestjs/common';
import { LocationClientType } from '@common/enum/location';
import { MapboxService } from '@server/shared/mapbox/mapbox.service';
import { LocationService } from './location.service';

@Resolver('Location')
export class LocationResolver {
  constructor(
    @Inject(forwardRef(() => LocationService))
    private readonly locationService: LocationService,
    @Inject(forwardRef(() => MapboxService))
    private readonly mapboxService: MapboxService
  ) {}

  @Query()
  public async searchPlace(
    @Args('value') value: string,
    @Args('region') region: string,
    @Args('clientType') type = LocationClientType.BAIDU
  ) {
    if (type === LocationClientType.BAIDU) {
      return this.locationService.search(value, region);
    }
    return this.mapboxService.forwardGeocode(region + value);
  }

  @Query()
  public async reverseGeocoding(@Args('location') location: string) {
    return this.locationService.reverseGeocoding(location);
  }

  @Query()
  public async placeSuggestion(
    @Args('value') value: string,
    @Args('region') region: string
  ) {
    return this.locationService.placeSuggestion(value, region);
  }

  @Query()
  public async placeDetail(@Args('uid') uid: string) {
    return this.locationService.placeDetail(uid);
  }
}
