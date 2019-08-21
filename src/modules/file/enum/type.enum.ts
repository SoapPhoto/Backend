import { $enum } from 'ts-enum-util';

export enum FlieType {
  AVATAR = 'AVATAR',
  PICTURE = 'PICTURE',
}

export const FlieTypeValues = $enum(FlieType).map(key => FlieType[key]);
