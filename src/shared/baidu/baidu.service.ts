import { Injectable, BadGatewayException } from '@nestjs/common';
import { Place } from '@server/modules/location/interface/place.interface';
import Axios from 'axios';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import gcoord from 'gcoord';
import { Position } from 'gcoord/dist/types/geojson';
import { qs } from 'url-parse';

import { BaiduClassify, BaiduToken } from './interface/baidu.interface';

@Injectable()
export class BaiduService {
  private mapToken = process.env.BAIDU_MAP_BACK_AK;

  private token?: BaiduToken;

  private expiresDate = dayjs().toString();

  public async getAccountToken() {
    if (dayjs(this.expiresDate).isBefore(dayjs()) || !this.token) {
      const { data } = await Axios.post<BaiduToken>('https://aip.baidubce.com/oauth/2.0/token', {}, {
        params: {
          grant_type: 'client_credentials',
          client_id: process.env.BAIDU_CLIENT_ID,
          client_secret: process.env.BAIDU_CLIENT_SECRET,
        },
      });
      this.token = data;
      this.expiresDate = dayjs().add(this.token.expires_in, 's').toString();
    }
    return this.token!;
  }

  /**
   * 使用百度ai获取图片的tag
   *
   * @param {string} base64
   * @returns
   * @memberof BaiduService
   */
  public async getImageClassify(image: string, url = false) {
    const token = await this.getAccountToken();
    const { data } = await Axios.post<{result: BaiduClassify[]}>('https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general',
      qs.stringify({ [url ? 'url' : 'image']: url ? image : image.split(',')[1] }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          access_token: token.access_token,
        },
      });
    if ((data as any).error_msg) {
      throw new BadGatewayException((data as any).error_msg);
    }
    if (data.result) {
      return data.result;
    }
    return [];
  }

  public async chinaPlaceSearch(region: string, query: string): Promise<Place[]> {
    const q = {
      ak: this.mapToken,
      scope: 2,
      output: 'json',
      ret_coordtype: 'gcj02ll',
      region,
      query,
    };
    const { data } = await Axios.post<any>('https://api.map.baidu.com/place/v2/search', {}, {
      params: q,
    });
    if (data.status === 0) {
      return plainToClass<Place, any[]>(Place, data.results);
    }
    return [];
  }

  public async abroadPlaceSearch(region: string, query: string): Promise<Place[]> {
    const q = {
      ak: this.mapToken,
      scope: 2,
      output: 'json',
      ret_coordtype: 'gcj02ll',
      region,
      query,
    };
    const { data } = await Axios.post<any>('http://api.map.baidu.com/place_abroad/v1/search', {}, {
      params: q,
    });
    if (data.status === 0) {
      return plainToClass<Place, any[]>(Place, data.results);
    }
    return [];
  }

  public async reverseGeocoding(location: string): Promise<Place[]> {
    const geo = location.split(',').map(v => Number(v))as [number, number];
    const { data } = await Axios.get('https://api.map.baidu.com/reverse_geocoding/v3/', {
      params: {
        location: gcoord.transform<Position>(geo, gcoord.GCJ02, gcoord.BD09).toString(),
        region: '全国',
        output: 'json',
        extensions_poi: 1,
        ak: process.env.BAIDU_MAP_BACK_AK,
        scope: 2,
      },
    });
    if (data.status === 0 && data.result && data.result.pois) {
      const { addressComponent, pois } = data.result;
      const address = {
        country: addressComponent.country,
        province: addressComponent.province,
        city: addressComponent.city,
        area: addressComponent.district,
      };
      return plainToClass<Place, any[]>(Place, pois.map((poi: any) => ({
        name: poi.name,
        ...address,
        location: {
          lng: poi.point.x,
          lat: poi.point.y,
        },
        address: poi.addr,
        uid: poi.uid,
        detail: {
          tag: poi.tag,
        },
      })));
    }
    return [];
  }
}
