import { isFunction } from 'lodash';

import { request } from '@lib/common/utils/request';
import { UploadType } from '@common/enum/upload';
import { uniqidTime, uniqid } from '@lib/common/utils/uniqid';

type onUploadProgress = (formatSpeed: string, percentComplete: number) => void;

export const getQiniuToken = async (type: UploadType) => (
  request.get<string>('/api/file/token', {
    params: {
      type,
    },
  })
);

export const uploadQiniu = async (
  file: File,
  type: UploadType = UploadType.PICTURE,
  onUploadProgress?: onUploadProgress,
) => {
  const { data: token } = await getQiniuToken(type);
  const formData = new FormData();
  const key = `${uniqid(type)}-${uniqidTime()}`;
  formData.append('file', file);
  formData.append('key', key);
  formData.append(
    'token',
    token,
  );
  await upload(formData, onUploadProgress);
  return key;
};

export const upload = async (formData: FormData, onUploadProgress?: onUploadProgress) => {
  let taking: number;
  const startDate = new Date().getTime();
  return request.post('//upload.qiniup.com', formData, {
    withCredentials: false,
    onUploadProgress(progressEvent: any) {
      if (progressEvent.lengthComputable) {
        const nowDate = new Date().getTime();
        taking = nowDate - startDate;
        const x = progressEvent.loaded / 1024;
        const y = taking / 1000;
        const uploadSpeed = x / y;
        let formatSpeed;
        if (uploadSpeed > 1024) {
          formatSpeed = `${(uploadSpeed / 1024).toFixed(2)}Mb/s`;
        } else {
          formatSpeed = `${uploadSpeed.toFixed(2)}Kb/s`;
        }
        const percentComplete = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        if (isFunction(onUploadProgress)) {
          onUploadProgress(formatSpeed, percentComplete);
        }
      }
    },
  });
};
