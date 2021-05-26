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

  public async search(region: string, value: string) {
    const placeList = await this.baiduService.chinaPlaceSearch(region, value);
    return placeList;
  }

  public async reverseGeocoding(location: string) {
    const data = await this.baiduService.reverseGeocoding(location);
    return data;
  }
}
