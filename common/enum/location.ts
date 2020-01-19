import { $enum } from 'ts-enum-util';

export enum LocationClientType {
  BAIDU = 'BAIDU',
  MAPBOX = 'MAPBOX'
}

export const LocationClientTypeValues = $enum(LocationClientType).map(key => LocationClientType[key]);
