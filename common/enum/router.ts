import { $enum } from 'ts-enum-util';

export enum SettingType {
  profile = 'profile',
  resetPassword = 'resetPassword',
  // basic = 'basic'
}

export const SettingTypeValues = $enum(SettingType).map(key => SettingType[key]);

export enum UserType {
  like = 'like',
  collections = 'collections'
}

export const UserTypeValues = $enum(UserType).map(key => UserType[key]);
