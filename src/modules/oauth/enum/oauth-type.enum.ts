import { $enum } from 'ts-enum-util';

export enum OauthType {
  github = 'github',
  google = 'google'
}

export const OauthTypeValues = $enum(OauthType).map(key => OauthType[key]);
