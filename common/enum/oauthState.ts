import { $enum } from 'ts-enum-util';

export enum OauthStateType {
  login = 'login',
  authorize = 'authorize'
}

export enum OauthActionType {
  login = 'login',
  authorize = 'authorize',
  active = 'active,'
}

export const OauthStateTypeValues = $enum(OauthStateType).map(key => OauthStateType[key]);
