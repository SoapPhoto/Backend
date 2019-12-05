import { $enum } from 'ts-enum-util';

export enum CredentialsType {
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
  WEIBO = 'WEIBO',
}

export const CredentialsTypeValues = $enum(CredentialsType).map(key => CredentialsType[key]);
