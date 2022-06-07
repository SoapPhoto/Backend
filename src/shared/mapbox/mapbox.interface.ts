// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/mapbox__mapbox-sdk/index.d.ts" />

import { GeocodeFeature } from '@mapbox/mapbox-sdk/services/geocoding';

export interface IMapboxGeocodeFeature extends Omit<GeocodeFeature, 'context'> {
  context: GeocodeFeature[];
}
