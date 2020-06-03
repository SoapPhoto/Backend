/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference path="../../../node_modules/@types/mapbox__mapbox-sdk/index.d.ts" />

import { Injectable } from '@nestjs/common';

import geocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { LngLatLike } from 'mapbox-gl';
import { plainToClass } from 'class-transformer';
import { PictureLocation } from '@server/modules/picture/interface/location.interface';
import { IMapboxGeocodeFeature } from './mapbox.interface';

@Injectable()
export class MapboxService {
  private geocodingClient = geocoding({ accessToken: process.env.MAPBOX_AK! })

  public async forwardGeocode(value: string) {
    const { body } = await this.geocodingClient.forwardGeocode({
      query: value,
      limit: 20,
      mode: 'mapbox.places',
      language: ['zh-CN', 'en'],
    }).send();
    if (body.features) {
      const list = body.features;
      list.map((geo: any) => {
        // const [type, id] = geo.id.split('.') as [string, string];
        const context: Record<string, any> = {};
        geo.context.forEach((ct: any) => {
          const [type] = ct.id.split('.');
          if (type) {
            context[type] = ct;
          }
        });
        geo.context = context;
        return geo;
      });
      return list as IMapboxGeocodeFeature[];
    }
    return [];
  }

  public async reverseGeocode(location: string | LngLatLike) {
    const { body } = await this.geocodingClient.reverseGeocode({
      query: location,
      limit: 1,
      types: ['poi'],
      mode: 'mapbox.places',
      language: ['zh-CN', 'en'],
    }).send();
    if (body.features) {
      const list = body.features;
      if (list[0]) {
        const info = list[0];
        const data: Record<string, any> = {};
        data.formatted_address = info.place_name;
        // const context: Record<string, any> = {};
        info.context.forEach((ct: any) => {
          const aliasName: Record<string, string> = {
            country: 'country',
            region: 'province',
            place: 'city',
            locality: 'district',
          };
          const [type] = ct.id.split('.');
          if (type) {
            data[aliasName[type]] = ct.text;
          }
        });
        return plainToClass(PictureLocation, data);
      }
      return list as IMapboxGeocodeFeature;
    }
    return null;
  }
}
