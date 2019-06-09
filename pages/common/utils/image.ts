import { extname } from 'path';

import { IEXIF } from '@typings/index';
import { changeToDu } from './gps';
import { round } from './math';

declare global {
// tslint:disable-next-line: interface-name
  interface Window {
    EXIF: any;
    FastAverageColor: any;
  }
}

export enum DefaultExifProperties {
  Model = 'model',
  Make = 'make',
  FocalLength = 'focalLength',
  FNumber = 'aperture',
  ExposureTime = 'exposureTime',
  ISOSpeedRatings = 'ISO',
}

export enum OptionalExifProperties {
  MeteringMode = 'meteringMode',
  ExposureProgram = 'exposureMode',
  ExposureBias = 'exposureBias',
  DateTimeOriginal = 'date',
  Software = 'software',
  _Location = 'location',
}

export const ExifProperties = {
  ...DefaultExifProperties,
  ...OptionalExifProperties,
};

export type ExifProperties = DefaultExifProperties | OptionalExifProperties;

export interface IImageInfo {
  exif: IEXIF;
  color: string;
  isDark: boolean;
  height: number;
  width: number;
  make: string | null;
  model: string | null;
}

export const pictureStyle = {
  full: '-pictureFull',
  raw: '',
  regular: '-pictureRegular',
  thumb: '-pictureThumb',
  blur: '-pictureThumbBlur',
};

export type PictureStyle = keyof typeof pictureStyle;

function parse(num: number) {
  // tslint:disable-next-line:radix
  return parseInt((num * 10).toString()) / 10;
}

type GetData = (image: File, cb: (this: any) => void) => void;

export function getImageUrl(image: File) {
  return window.URL.createObjectURL(image);
}

export function convertEXIFValue(label: ExifProperties, value: any, exifData: any) {
  switch (label) {
    case ExifProperties.FocalLength:
      return round(value, 2);
    case ExifProperties.FNumber:
    case ExifProperties.ExposureBias:
      return round(value, 1);
    case ExifProperties.ExposureTime:
      return round(value >= 1 ? value : 1 / value, 1);
    case ExifProperties._Location:
      return [
        changeToDu(
          exifData.GPSLatitude[0],
          exifData.GPSLatitude[1],
          exifData.GPSLatitude[2],
        ),
        changeToDu(
          exifData.GPSLongitude[0],
          exifData.GPSLongitude[1],
          exifData.GPSLongitude[2],
        ),
      ];
    default:
      return value;
  }
}

export function formatEXIFValue(label: ExifProperties, value: any, originalValue: any) {
  return new Promise<any>((resolve) => {
    if (typeof value === 'undefined') {
      resolve(null);
      return;
    }

    switch (label) {
      case ExifProperties.FocalLength:
        return resolve(value);
      case ExifProperties.FNumber:
        return resolve(value);
      case ExifProperties.ExposureTime:
        return resolve(value);
      case ExifProperties.ExposureBias:
        return resolve(value);
      case ExifProperties.DateTimeOriginal:
        return resolve(
          (([date, hour]) => [
            date.replace(/\:/g, '/'),
            hour
              .split(':')
              .splice(0, 2)
              .join(':'),
          ])(value.split(' ')).join(' '),
        );
      case ExifProperties._Location:
        return resolve(value);
      default:
        return resolve(value);
    }
  });
}

export function getImageEXIF(image: File) {
  return new Promise<IEXIF>((resolve, reject) => {
    (window.EXIF.getData as GetData)(image, async () => {
      const data = (image as any).exifdata;
      const exifData = await Promise.all(
        Object.keys(ExifProperties).map(async (value) => {
          const label = (value as any) as ExifProperties;
          const formatValue = await formatEXIFValue(
            ExifProperties[(label as any)] as any,
            convertEXIFValue(ExifProperties[(label as any)] as any, data[value], data),
            data[value],
          );
          return {
            key: label,
            title: ExifProperties[(label as any)] as ExifProperties,
            value: formatValue,
          };
        }),
      );
      const newData: {[key in ExifProperties]?: any} = {};
      exifData
        .filter(_ => _.value !== null && _.value !== 'NaN' && !isNaN(_.value))
        .forEach(exif => newData[exif.title] = exif.value);
      resolve(newData);
    });
  });
}

/**
 * 获取图片详细信息
 *
 * @export
 * @param {File} image
 * @returns {Promise<[IImageInfo, string]>}
 */
export async function getImageInfo(image: File): Promise<[IImageInfo, string]> {
  return new Promise((resolve) => {
    window.EXIF.getData(image, async () => {
      const info: IImageInfo = {
        exif: {},
        color: '#fff',
        isDark: false,
        height: 0,
        width: 0,
        make: null,
        model: null,
      };
      const imgSrc = window.URL.createObjectURL(image);
      const imgHtml = document.createElement('img');
      imgHtml.src = imgSrc;
      const fac = new window.FastAverageColor();
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
      info.exif = await getImageEXIF(image);
      resolve([info, imgSrc]);
    });
  });
}

/**
 * 判断文件是否是图片格式
 *
 * @export
 * @param {string} fileName
 * @returns
 */
export function isImage(fileName: string) {
  const imgType = [
    '.jpg',
    '.JPG',
    '.png',
  ];
  const ext = extname(fileName);
  return imgType.indexOf(ext) >= 0;
}

export function getPictureUrl(key: string, style: PictureStyle = 'regular') {
  return `//cdn.soapphoto.com/${key}${pictureStyle[style]}`;
}
