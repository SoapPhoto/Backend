import { $enum } from 'ts-enum-util';

export enum UploadType {
  PICTURE = 'PICTURE',
  AVATAR = 'AVATAR',
}

export const UploadTypeValues = $enum(UploadType).map(key => UploadType[key]);
