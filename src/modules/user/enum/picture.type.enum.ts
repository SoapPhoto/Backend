import { $enum } from 'ts-enum-util';

export enum UserPictureType {
  MY = 'MY',
  LIKED = 'LIKED',
}

export const UserPictureTypeValues = $enum(UserPictureType).map(key => UserPictureType[key]);
