import { $enum } from 'ts-enum-util';

export enum FileType {
  AVATAR = 'AVATAR',
  PICTURE = 'PICTURE',
  USER_COVER = 'USER_COVER',
}

export const FileTypeValues = $enum(FileType).map(key => FileType[key]);
