import { IEXIF } from '@typings/types';

export interface IImgInfo {
  exif: IEXIF;
  color: string;
  isDark: string;
  height: number;
  width: number;
}
