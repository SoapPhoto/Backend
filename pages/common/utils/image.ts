import { changeToDu } from './gps';

export interface IEXIF {
  aperture?: number;
  exposureTime?: string;
  focalLength?: number;
  iso?: string;
  gps?: [number, number];
}

export interface IImageInfo {
  exif: IEXIF;
  color: string;
  isDark: boolean;
  height: number;
  width: number;
  make: string | null;
  model: string | null;
}

// tslint:disable-next-line:variable-name
function parse(num: number) {
  // tslint:disable-next-line:radix
  return parseInt((num * 10).toString()) / 10;
}

export async function getImageInfo(image: any): Promise<[IImageInfo, string]> {
  return new Promise((resolve): any => {
    if (!image) {
      return [{}, ''];
    }
    (window as any).EXIF.getData(image, async function () {
      const allMetaData = (window as any).EXIF.getAllTags(this);
      const info: IImageInfo = {
        exif: {},
        color: '#fff',
        isDark: false,
        height: 0,
        width: 0,
        make: null,
        model: null,
      };
      const exifData: IEXIF = {};
      const imgSrc = window.URL.createObjectURL(image);
      const imgHtml = document.createElement('img');
      imgHtml.src = imgSrc;
      const fac = new (window as any).FastAverageColor();
      await (async() => {
        return new Promise((res) => {
          imgHtml.onload = () => {
            const color  = fac.getColor(imgHtml);
            info.color = color.hex;
            info.isDark = color.isDark;
            info.height = imgHtml.naturalHeight;
            info.width = imgHtml.naturalWidth;
            res();
          };
        });
      })();
      if (allMetaData.ApertureValue) {
        exifData.aperture = parse(allMetaData.ApertureValue);
      }
      if (allMetaData.FNumber) {
        exifData.aperture = parse(allMetaData.FNumber);
      }
      if (allMetaData.ExposureTime) {
        exifData.exposureTime = `${allMetaData.ExposureTime.numerator}/${
          allMetaData.ExposureTime.denominator
        }`;
      }
      if (allMetaData.FocalLength) {
        exifData.focalLength = parse(allMetaData.FocalLength);
      }
      if (allMetaData.ISOSpeedRatings) {
        exifData.iso = allMetaData.ISOSpeedRatings;
      }
      if (allMetaData.Make) {
        info.make = allMetaData.Make;
      }
      if (allMetaData.Model) {
        info.model = allMetaData.Model;
      }
      if (allMetaData.GPSLatitude && allMetaData.GPSLatitude.length === 3) {
        exifData.gps = [
          changeToDu(
            allMetaData.GPSLatitude[0],
            allMetaData.GPSLatitude[1],
            allMetaData.GPSLatitude[2],
          ),
          changeToDu(
            allMetaData.GPSLongitude[0],
            allMetaData.GPSLongitude[1],
            allMetaData.GPSLongitude[2],
          ),
        ];
      }
      info.exif = exifData;
      resolve([info, imgSrc]);
    });
  });
}
