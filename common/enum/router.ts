import { $enum } from 'ts-enum-util';

export enum SettingType {
  profile = 'profile',
  resetPassword = 'resetPassword',
  account = 'account'
}

export enum UserType {
  like = 'like',
  collections = 'collections'
}

export enum PictureType {
  info = 'info',
  addCollection = 'addCollection',
  setting = 'setting',
}

export enum CollectionType {
  setting = 'setting',
}

export enum OauthType {
  GITHUB = 'GITHUB',
  GOOGLE = 'GOOGLE',
  WEIBO = 'WEIBO',
}


export const SettingTypeValues = $enum(SettingType).map(key => SettingType[key]);
export const UserTypeValues = $enum(UserType).map(key => UserType[key]);
export const PictureTypeValues = $enum(PictureType).map(key => PictureType[key]);
export const CollectionTypeValues = $enum(CollectionType).map(key => CollectionType[key]);
export const OauthTypeValues = $enum(OauthType).map(key => OauthType[key]);
