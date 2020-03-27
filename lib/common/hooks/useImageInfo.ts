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
  useCallback, useRef, MutableRefObject,
} from 'react';
import { useApolloClient } from 'react-apollo';
import { useLocalStore } from 'mobx-react';

import Toast from '@lib/components/Toast';
import { useTranslation } from '@lib/i18n/useTranslation';
import { ReverseGeocoding } from '@lib/schemas/query';
import {
  getImageInfo, isImage, IImageInfo, getImageClassify, getImageColor, getImageBlurhash,
} from '../utils/image';
import { ImageClassify, PictureLocation } from '../interfaces/picture';

interface IImageData {
  imageUrl: string;
  imageInfo?: IImageInfo;
  imageLocation?: PictureLocation;
  classify: ImageClassify[];
  loading: boolean;
}

export type ReturnType = [
  IImageData,
  (file: File) => Promise<void>,
  (value: string) => void,
  (value: IImageInfo | undefined) => void,
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
  const imageData = useLocalStore<IImageData>(() => ({
    imageInfo: undefined,
    imageUrl: '',
    classify: [],
    loading: false,
    imageLocation: undefined,
  }));
  // TODO 获取图片信息
  const getClassify = useCallback(async () => {
    if (base64Ref.current) {
      const data = await getImageClassify(base64Ref.current);
      console.log(data);
      // setClassify(data);
    }
  }, []);
  const getBlurhash = useCallback(async () => {
    const blurhash = await getImageBlurhash(base64Ref.current);
    if (blurhash && imageData.imageInfo) {
      imageData.imageInfo.blurhash = blurhash;
    }
  }, [imageData.imageInfo]);
  const getColor = useCallback(async () => {
    const imgHtml = document.createElement('img');
    imgHtml.src = imageData.imageUrl;
    const color = await getImageColor(imgHtml);
    if (imageData.imageInfo) {
      imageData.imageInfo.color = color.hex;
      imageData.imageInfo.isDark = color.isDark;
    }
  }, [imageData.imageInfo, imageData.imageUrl]);
  // 获取图片的信息
  const getLocation = useCallback(async () => {
    if (imageData.imageInfo?.exif?.location) {
      const { data } = await apollo.query({
        query: ReverseGeocoding,
        variables: {
          location: imageData.imageInfo.exif.location.toString(),
        },
        fetchPolicy: 'network-only',
      });
      imageData.imageLocation = data.reverseGeocoding;
    }
  }, [apollo, imageData.imageInfo, imageData.imageLocation]);
  const getInfo = useCallback(async () => {
    imageData.loading = true;
    try {
      await Promise.all([
        getLocation(),
        getColor(),
        // getClassify(),
        getBlurhash(),
      ]);
    } catch (err) {
      Toast.error('获取图片信息失败！');
    } finally {
      imageData.loading = false;
    }
  }, [imageData.loading, getLocation, getColor, getBlurhash]);
  // 获取图片的基本信息
  const setFile = useCallback(async (file: File) => {
    if (isImage(file.name)) {
      try {
        imageRef.current = file;
        const [info, url, base64] = await getImageInfo(file);
        base64Ref.current = base64;
        // TODO 获取图片信息失败
        // getImageClassify();
        imageData.imageUrl = url;
        imageData.imageInfo = info;
        getInfo();
      } catch (err) {
        Toast.error('获取图片信息失败');
        console.log(err);
      }
    } else {
      Toast.warning(t('upload.message.image_format_error'));
    }
  }, [imageRef, getInfo, imageData.imageUrl, imageData.imageInfo, t]);
  const clear = useCallback(() => {
    imageData.imageInfo = undefined;
    imageData.imageUrl = '';
    imageData.classify = [];
    imageData.imageLocation = undefined;
  }, [imageData.classify, imageData.imageInfo, imageData.imageLocation, imageData.imageUrl]);
  const setImageUrl = useCallback((value: string) => {
    imageData.imageUrl = value;
  }, [imageData.imageUrl]);
  const setImageInfo = useCallback((value?: IImageInfo) => {
    imageData.imageInfo = value;
  }, [imageData.imageInfo]);
  return [imageData, setFile, setImageUrl, setImageInfo, clear];
};
