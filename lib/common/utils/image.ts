import _ from 'lodash';
import { extname } from 'path';
import { $enum } from 'ts-enum-util';

import { changeToDu } from './gps';
import { round } from './math';

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window {
    EXIF: any;
    FastAverageColor: any;
  }
}

export enum ExifProperties {
  Model = 'model',
  Make = 'make',
  FocalLength = 'focalLength',
  FNumber = 'aperture',
  ExposureTime = 'exposureTime',
  ISOSpeedRatings = 'ISO',
  MeteringMode = 'meteringMode',
  ExposureProgram = 'exposureMode',
  ExposureBias = 'exposureBias',
  DateTimeOriginal = 'date',
  Software = 'software',
  _Location = 'location',
}

export interface IImageInfo {
  exif: IEXIF;
  color: string;
  isDark: boolean;
  height: number;
  width: number;
  make?: string;
  model?: string;
}

export const pictureStyle = {
  full: '-pictureFull',
  raw: '',
  small: '-pictureSmall',
  regular: '-pictureRegular',
  thumb: '-pictureThumb',
  blur: '-pictureThumbBlur',
};

export type PictureStyle = keyof typeof pictureStyle;

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
      if (!exifData.GPSLatitude) {
        return undefined;
      }
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
      case ExifProperties.ExposureTime:
        resolve(`${originalValue >= 1 ? value : `1/${value}`}`);
        break;
      case ExifProperties.ExposureBias:
        resolve(`${value >= 0 ? '+' : ''}${value}`);
        break;
      case ExifProperties.DateTimeOriginal:
        resolve(
          (([date, hour]) => [
            // eslint-disable-next-line no-useless-escape
            date.replace(/\:/g, '/'),
            hour
              .split(':')
              .splice(0, 2)
              .join(':'),
          ])(value.split(' ')).join(' '),
        );
        break;
      default:
        resolve(value);
    }
  });
}

export function getImageEXIF(image: File) {
  return new Promise<IEXIF>((resolve) => {
    window.EXIF.getData(image, async () => {
      const data = (image as any).exifdata;
      const exifData = await Promise.all(
        $enum(ExifProperties).map(async (value, content) => {
          const formatValue = await formatEXIFValue(
            value,
            convertEXIFValue(value, data[content], data),
            data[content],
          );
          return {
            key: content,
            title: value,
            value: formatValue,
          };
        }),
      );
      const newData: Partial<Record<ExifProperties, any>> = {};
      exifData
        .filter(_data => (
          typeof _data.value === 'number'
            && !Number.isNaN(_data.value))
            || (_data.value !== null && _data.value !== 'NaN'))
        .forEach((exif) => { newData[exif.title] = exif.value; });
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
        make: undefined,
        model: undefined,
      };
      const imgSrc = window.URL.createObjectURL(image);
      const imgHtml = document.createElement('img');
      imgHtml.src = imgSrc;
      const fac = new window.FastAverageColor();
      await (async () => new Promise((res) => {
        imgHtml.onload = () => {
          const color = fac.getColor(imgHtml);
          info.color = color.hex;
          info.isDark = color.isDark;
          info.height = imgHtml.naturalHeight;
          info.width = imgHtml.naturalWidth;
          res();
        };
      }))();
      const exif = await getImageEXIF(image);
      info.make = exif.make;
      info.model = exif.model;
      info.exif = _.omit(exif, ['model', 'make']);
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
    '.jpeg',
    '.png',
  ];
  const ext = extname(fileName);
  return imgType.indexOf(ext.toLocaleLowerCase()) >= 0;
}

export function getPictureUrl(key: string, style: PictureStyle = 'regular') {
  if (/default.svg$/.test(key)) {
    return `${key}`;
  }
  if (/^\/\/cdn/.test(key)) {
    return `${key}${pictureStyle[style]}`;
  }
  if (/^blob:/.test(key)) {
    return key;
  }
  return `//cdn.soapphoto.com/${key}${pictureStyle[style]}`;
}
