import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { MapboxService } from '@server/shared/mapbox/mapbox.service';
import { BaiduService } from '@server/shared/baidu/baidu.service';

@Injectable()
export class LocationService {
  constructor(
    @Inject(forwardRef(() => MapboxService))
    private readonly mapboxService: MapboxService,
    @Inject(forwardRef(() => BaiduService))
    private readonly baiduService: BaiduService,
  ) {}

  public async search(value: string, region?: string) {
    const placeList = await this.baiduService.chinaPlaceSearch(value, region);
    return placeList;
  }

  public async placeSuggestion(value: string, region: string) {
    const placeList = await this.baiduService.placeSuggestion(value, region);
    return placeList;
  }

  public async placeDetail(uid: string) {
    const placeDetail = await this.baiduService.placeDetail(uid);
    return placeDetail;
  }

  public async reverseGeocoding(location: string) {
    const data = await this.baiduService.reverseGeocoding(location);
    return data;
  }
}
