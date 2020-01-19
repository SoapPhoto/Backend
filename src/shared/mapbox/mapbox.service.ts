/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference path="../../../node_modules/@types/mapbox__mapbox-sdk/index.d.ts" />

import { Injectable } from '@nestjs/common';

import geocoding from '@mapbox/mapbox-sdk/services/geocoding';
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
}
