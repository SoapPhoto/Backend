/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.base.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.control.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.core.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.maptype.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.overlay.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.panorama.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.rightmenu.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.service.d.ts" />
/// <reference path="../../../node_modules/@types/baidumap-web-sdk/baidumap.tools.d.ts" />

import {
  useCallback, useState, SetStateAction, Dispatch, useRef, MutableRefObject,
} from 'react';
import { useApolloClient } from 'react-apollo';

import Toast from '@lib/components/Toast';
import { useTranslation } from '@lib/i18n/useTranslation';
import { ReverseGeocoding } from '@lib/schemas/query';
import { transform, GCJ02, BD09 } from 'gcoord';
import {
  getImageInfo, isImage, IImageInfo, getImageClassify, formatLocationData,
} from '../utils/image';
import { ImageClassify } from '../interfaces/picture';

export type ReturnType = [
  { imageUrl: string; imageInfo: IImageInfo | undefined; classify: ImageClassify[] },
  (file: File) => Promise<void>,
  Dispatch<SetStateAction<string>>,
  Dispatch<SetStateAction<IImageInfo | undefined>>,
  () => void
]
/**
 * 获取图片的exif，位置，关键词信息
 *
 * @returns {ReturnType}
 */
export const useImageInfo = (imageRef: MutableRefObject<File | undefined>): ReturnType => {
  const { t } = useTranslation();
  const apollo = useApolloClient();
  const base64Ref = useRef('');
  const [imageInfo, setImageInfo] = useState<IImageInfo>();
  const [imageUrl, setImageUrl] = useState('');
  const [classify, setClassify] = useState<ImageClassify[]>([]);
  // TODO 获取图片信息
  const setImageClassify = useCallback(async () => {
    if (base64Ref.current) {
      const data = await getImageClassify(base64Ref.current);
      setClassify(data);
    }
  }, []);
  const setFile = useCallback(async (file: File) => {
    if (isImage(file.name)) {
      try {
        imageRef.current = file;
        const [info, url, base64] = await getImageInfo(file);
        if (info.exif.location) {
          const data = await (() => new Promise<any>((resolve, reject) => {
            const myGeo = new BMap.Geocoder();
            myGeo.getLocation(new BMap.Point(
              ...transform([info.exif.location![1], info.exif.location![0]], GCJ02, BD09) as [number, number],
            ), (result) => {
              if (result) {
                resolve(result);
              } else {
                reject(new Error('error getLocation'));
              }
            }, {
              poiRadius: 200,
              numPois: 20,
            });
          }))();
          info.location = formatLocationData(data);
          // const { data } = await apollo.query({
          //   query: ReverseGeocoding,
          //   variables: {
          //     location: info.exif.location.toString(),
          //   },
          //   fetchPolicy: 'network-only',
          // });
          // info.location = data.reverseGeocoding;
        }
        base64Ref.current = base64;
        // TODO 获取图片信息
        // setImageClassify();
        setImageUrl(url);
        setImageInfo(info);
      } catch (err) {
        Toast.error('获取图片信息失败');
        console.log(err);
      }
    } else {
      Toast.warning(t('upload.message.image_format_error'));
    }
  }, [imageRef, t]);
  const clear = useCallback(() => {
    setImageUrl('');
    setImageInfo(undefined);
  }, []);
  return [{ imageUrl, imageInfo, classify }, setFile, setImageUrl, setImageInfo, clear];
};
