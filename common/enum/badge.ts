import { $enum } from 'ts-enum-util';

export enum BadgeType {
  USER = 'USER',
  PICTURE = 'PICTURE'
}

export enum BadgeRate {
  ordinary = 'ordinary',
  bronze = 'bronze',
  cert = 'cert'
}

export const BadgeTypeValues = $enum(BadgeType).map(key => BadgeType[key]);
