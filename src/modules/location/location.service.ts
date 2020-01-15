import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { pick } from 'lodash';
import { PictureLocation } from '../picture/interface/location.interface';

@Injectable()
export class LocationService {
  public async search(value: string) {
    try {
      const { data } = await axios.get('https://api.map.baidu.com/place/v2/search', {
        params: {
          query: value,
          region: '全国',
          output: 'json',
          ak: process.env.BAIDU_MAP_BACK_AK,
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
      const { data } = await axios.get('https://api.map.baidu.com/reverse_geocoding/v3/', {
        params: {
          location,
          // eslint-disable-next-line @typescript-eslint/camelcase
          extensions_road: true,
          region: '全国',
          output: 'json',
          ak: process.env.BAIDU_MAP_BACK_AK,
          scope: 2,
        },
      });
      if (data.status === 0) {
        const pictureLocation = plainToClass(PictureLocation, {
          ...data.result.addressComponent,
          ...pick(data.result, ['sematic_description', 'business', 'formatted_address']),
        });
        pictureLocation.roads = data.result.roads.map((v: any) => v.name);
        return pictureLocation;
      }
      return null;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
