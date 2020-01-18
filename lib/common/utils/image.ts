
import { omit, pick } from 'lodash';
import { extname } from 'path';
import { $enum } from 'ts-enum-util';
import {
  transform, GCJ02, WGS84,
} from 'gcoord';

import { validator } from '@common/validator';
import { imageClassify } from '@lib/services/picture';
import { changeToDu } from './gps';
import { round } from './math';
import { PictureLocation } from '../interfaces/picture';

export const ORIENT_TRANSFORMS: Record<number, string> = {
  1: '',
  2: 'rotateY(180deg)',
  3: 'rotate(180deg)',
  4: 'rotate(180deg) rotateY(180deg)',
  5: 'rotate(270deg) rotateY(180deg)',
  6: 'rotate(90deg)',
  7: 'rotate(90deg) rotateY(180deg)',
  8: 'rotate(270deg)',
};

export const ORIENT_ORIENTATION: Record<number, string> = {
  1: '',
  2: 'flip',
  3: '180deg',
  4: '180deg flip',
  5: '270deg flip',
  6: '90deg',
  7: '90deg flip',
  8: '270deg',
};

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window {
    EXIF: any;
    exifer: any;
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
  Orientation = 'orientation',
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
  location?: PictureLocation;
}

export const pictureStyle = {
  full: '-pictureFull',
  raw: '',
  small: '-pictureSmall',
  regular: '-pictureRegular',
  thumb: '-pictureThumb',
  blur: '-pictureThumbBlur',
  itemprop: '-itemprop',
  thumbSmall: '-pictureThumbSmall',
};

export type PictureStyle = keyof typeof pictureStyle;

type GetData = (image: File, cb: (this: any) => void) => void;

export function getImageUrl(image: File) {
  return window.URL.createObjectURL(image);
}

export function convertEXIFValue(label: ExifProperties, value: any, exifData: any) {
  if (validator.isEmpty(value) && label !== ExifProperties._Location) {
    return null;
  }
  let gps: string[] = [];
  switch (label) {
    case ExifProperties.FocalLength:
      return round(value, 2);
    case ExifProperties.FNumber:
    case ExifProperties.ExposureBias:
      return round(value, 1);
    case ExifProperties.ExposureTime:
      if (validator.isEmpty(value)) {
        return null;
      }
      return round(value >= 1 ? value : 1 / value, 1);
    case ExifProperties._Location:
      if (!exifData?.GPSLatitude || exifData?.GPSLatitude?.[0]?.toString() === 'NaN') {
        return undefined;
      }
      if (exifData.Make === 'Apple') {
        gps = transform([
          changeToDu(
            exifData.GPSLongitude[0],
            exifData.GPSLongitude[1],
            exifData.GPSLongitude[2],
          ),
          changeToDu(
            exifData.GPSLatitude[0],
            exifData.GPSLatitude[1],
            exifData.GPSLatitude[2],
          ),
        ], WGS84, GCJ02) as any as string[];
        return [gps[1], gps[0]];
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
    if (validator.isEmpty(value)) {
      resolve(null);
    } else {
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

export function getImageMinSize(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) {
  // 目标尺寸
  let targetWidth = width;
  let targetHeight = height;
  // 图片尺寸超过400x400的限制
  if (width > maxWidth || height > maxHeight) {
    if (width / height > maxWidth / maxHeight) {
      // 更宽，按照宽度限定尺寸
      targetWidth = maxWidth;
      targetHeight = Math.round(maxWidth * (height / width));
    } else {
      targetHeight = maxHeight;
      targetWidth = Math.round(maxHeight * (width / height));
    }
  }
  return [targetWidth, targetHeight];
}

export function previewImage(
  img: HTMLImageElement,
  minSize = 600,
  orientation?: number,
  isBase64 = false,
): Promise<string> {
  return new Promise((resolve) => {
    const [width, height] = getImageMinSize(img.naturalWidth, img.naturalHeight, minSize, minSize);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    switch (orientation) {
      case 2:
        canvas.width = width;
        canvas.height = height;
        // horizontal flip
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        break;
      case 3:
        canvas.width = width;
        canvas.height = height;
        // 180 graus
        ctx.translate(width / 2, height / 2);
        ctx.rotate((180 * Math.PI) / 180);
        ctx.translate(-width / 2, -height / 2);
        break;
      case 4:
        canvas.width = width;
        canvas.height = height;
        // vertical flip
        ctx.translate(0, height);
        ctx.scale(1, -1);
        break;
      case 5:
        // vertical flip + 90 rotate right
        canvas.height = width;
        canvas.width = height;
        ctx.rotate(0.5 * Math.PI);
        ctx.scale(1, -1);
        break;
      case 6:
        canvas.width = height;
        canvas.height = width;
        // 90 graus
        ctx.translate(height / 2, width / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.translate(-width / 2, -height / 2);
        break;
      case 7:
        // horizontal flip + 90 rotate right
        canvas.height = width;
        canvas.width = height;
        ctx.rotate(0.5 * Math.PI);
        ctx.translate(width, -height);
        ctx.scale(-1, 1);
        break;
      case 8:
        canvas.height = width;
        canvas.width = height;
        // -90 graus
        ctx.translate(height / 2, width / 2);
        ctx.rotate((-90 * Math.PI) / 180);
        ctx.translate(-width / 2, -height / 2);
        break;
      default:
        canvas.width = width;
        canvas.height = height;
    }
    ctx.drawImage(img, 0, 0, width, height);
    if (isBase64) {
      resolve(canvas.toDataURL());
    } else {
      canvas.toBlob((blob) => {
        resolve(window.URL.createObjectURL(blob));
      });
    }
  });
}

export async function getImageClassify(base64: string) {
  const { data } = await imageClassify(base64);
  return data;
}

// export async function getLocation(gcj: number[]) {
//   // Toast.error(data?.msg ?? '获取图片位置信息失败');
//   // console.error(data);
//   return undefined;
// }

/**
 * 获取图片详细信息
 *
 * @export
 * @param {File} image
 * @returns {Promise<[IImageInfo, string, string]>}
 */
export async function getImageInfo(
  image: File,
): Promise<[IImageInfo, string, string]> {
  const info: IImageInfo = {
    exif: {},
    color: '#fff',
    isDark: false,
    height: 0,
    width: 0,
    make: undefined,
    model: undefined,
    location: undefined,
  };
  const imgSrc = window.URL.createObjectURL(image);
  const imgHtml = document.createElement('img');
  imgHtml.src = imgSrc;
  const fac = new window.FastAverageColor();
  const exif = await getImageEXIF(image);
  info.make = exif.make;
  info.model = exif.model;
  info.exif = omit(exif, ['model', 'make']);
  const previewSrc = await (async () => new Promise<string>((res) => {
    const setInfo = async () => {
      const color = fac.getColor(imgHtml);
      info.color = color.hex;
      info.isDark = color.isDark;
      info.height = imgHtml.naturalHeight;
      info.width = imgHtml.naturalWidth;
      if (info.exif && info.exif.orientation) {
        // 有翻转的长宽对调
        if (info.exif.orientation >= 5) {
          info.height = imgHtml.naturalWidth;
          info.width = imgHtml.naturalHeight;
        }
      }
      res(await previewImage(imgHtml, 800, info.exif.orientation));
    };
    if (imgHtml.complete) {
      setInfo();
    } else {
      imgHtml.onload = async () => {
        setInfo();
      };
    }
  }))();
  return [info, previewSrc, await previewImage(imgHtml, 600, info.exif.orientation, true)];
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
  if (/\/\//.test(key)) {
    return key;
  }
  return `//cdn.soapphoto.com/${key}${pictureStyle[style]}`;
}

export function formatLocationData(data: any): PictureLocation {
  const newData = {
    address: data.address,
    ...data.addressComponents,
    ...pick(data, ['sematic_description', 'business', 'formatted_address', 'point']),
  };
  newData.pois = [];
  if (data.surroundingPois?.length > 0) {
    newData.pois = data.surroundingPois;
  }
  return newData;
}

export function formatLocationTitle(location: PictureLocation): string {
  if (location.pois?.length > 0) {
    if (location.pois[0].Ji === '旅游景点') {
      return `${location.pois[0].city || ''}${location.pois[0].title || ''}`;
    }
  }
  let title = (location.country ?? '') + (location.province ?? '');
  if (location.province !== location.city) {
    title += (location.city ?? '');
  }
  return title;
}
