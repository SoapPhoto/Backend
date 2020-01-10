import {
  useCallback, useState, SetStateAction, Dispatch, useRef,
} from 'react';

import Toast from '@lib/components/Toast';
import { useTranslation } from '@lib/i18n/useTranslation';
import {
  getImageInfo, isImage, IImageInfo, getImageClassify,
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
export const useImageInfo = (): ReturnType => {
  const { t } = useTranslation();
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
        const [info, url, base64] = await getImageInfo(file);
        base64Ref.current = base64;
        // TODO 获取图片信息
        // setImageClassify();
        setImageUrl(url);
        setImageInfo(info);
      } catch (err) {
        console.log(err);
      }
    } else {
      Toast.warning(t('upload.message.image_format_error'));
    }
  }, [t]);
  const clear = useCallback(() => {
    setImageUrl('');
    setImageInfo(undefined);
  }, []);
  return [{ imageUrl, imageInfo, classify }, setFile, setImageUrl, setImageInfo, clear];
};
