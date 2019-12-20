import { $enum } from 'ts-enum-util';

export enum UserPictureType {
  MY = 'MY',
  LIKED = 'LIKED',
}


export enum PicturesType {
  HOT = 'HOT',
  NEW = 'NEW',
}

export const UserPictureTypeValues = $enum(UserPictureType).map(key => UserPictureType[key]);
export const PicturesTypeValues = $enum(PicturesType).map(key => PicturesType[key]);
