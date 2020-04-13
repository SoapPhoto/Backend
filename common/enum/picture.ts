import { $enum } from 'ts-enum-util';

export enum UserPictureType {
  MY = 'MY',
  LIKED = 'LIKED',
  CHOICE = 'CHOICE',
}


export enum PicturesType {
  HOT = 'HOT',
  NEW = 'NEW',
  CHOICE = 'CHOICE',
  FEED = 'FEED',
}

export const UserPictureTypeValues = $enum(UserPictureType).map(key => UserPictureType[key]);
export const PicturesTypeValues = $enum(PicturesType).map(key => PicturesType[key]);
