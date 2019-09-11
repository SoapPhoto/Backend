import { $enum } from 'ts-enum-util';

export enum OauthType {
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE'
}

export const OauthTypeValues = $enum(OauthType).map(key => OauthType[key]);
