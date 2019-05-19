
export interface IEXIF {
  aperture?: number;
  exposureTime?: string;
  focalLength?: number;
  iso?: number;
  gps?: [number, number];
}

export interface IImgInfo {
  exif: IEXIF;
  color: string;
  isDark: string;
  height: number;
  width: number;
}
