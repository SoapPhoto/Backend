import { $enum } from 'ts-enum-util';

export enum OauthStateType {
  login = 'login',
  authorize = 'authorize'
}

export const OauthStateTypeValues = $enum(OauthStateType).map(key => OauthStateType[key]);
