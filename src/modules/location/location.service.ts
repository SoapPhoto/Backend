import { Injectable, Inject, forwardRef } from '@nestjs/common';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { pick } from 'lodash';
import { MapboxService } from '@server/shared/mapbox/mapbox.service';
import { transform, GCJ02, BD09 } from 'gcoord';
import { PictureLocation } from '../picture/interface/location.interface';

@Injectable()
export class LocationService {
  constructor(
    @Inject(forwardRef(() => MapboxService))
    private readonly mapboxService: MapboxService,
  ) {}

  public async search(value: string) {
    try {
      const { data } = await axios.get('https://api.map.baidu.com/place/v2/search', {
        params: {
          query: value,
          region: '全国',
          output: 'json',
          ak: process.env.BAIDU_MAP_BACK_AK,
          // eslint-disable-next-line @typescript-eslint/camelcase
          coord_type: 1,
          scope: 2,
        },
      });
      if (data.status === 0) {
        return data.results;
      }
      return [];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async reverseGeocoding(location: string) {
    try {
      const geo = location.split(',');
      const { data } = await axios.get('https://api.map.baidu.com/reverse_geocoding/v3/', {
        params: {
          location: transform(geo, GCJ02, BD09).toString(),
          // eslint-disable-next-line @typescript-eslint/camelcase
          extensions_road: true,
          region: '全国',
          output: 'json',
          limit: 5,
          // eslint-disable-next-line @typescript-eslint/camelcase
          extensions_poi: 1,
          // eslint-disable-next-line @typescript-eslint/camelcase
          poi_types: '自然地物|旅游景点|文化传媒|休闲娱乐|风景区|飞机场|火车站|地铁站|教育培训|房地产|医疗',
          ak: process.env.BAIDU_MAP_BACK_AK,
          scope: 2,
        },
      });
      if (data.status === 0) {
        const pictureLocation = plainToClass(PictureLocation, {
          ...data.result.addressComponent,
          ...pick(data.result, ['sematic_description', 'business', 'formatted_address', 'pois', 'location']),
        });
        // pictureLocation.roads = data.result.roads.map((v: any) => v.name);
        // TODO: 国外数据处理，暂时不支持
        // if (pictureLocation.country !== '中国') {
        //   console.log(await this.mapboxService.reverseGeocode([data.result.location.lng, data.result.location.lat]));
        // }
        pictureLocation.location = {
          lng: Number(geo[1]),
          lat: Number(geo[0]),
        };
        return pictureLocation;
      }
      return null;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
