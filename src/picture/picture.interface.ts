import { IEXIF } from '@typings/index';

export interface IImgInfo {
  exif: IEXIF;
  color: string;
  isDark: string;
  height: number;
  width: number;
}
