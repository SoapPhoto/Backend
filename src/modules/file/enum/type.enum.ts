import { $enum } from 'ts-enum-util';

export enum FileType {
  AVATAR = 'AVATAR',
  PICTURE = 'PICTURE',
}

export const FileTypeValues = $enum(FileType).map(key => FileType[key]);
