import { request } from '@lib/common/utils/request';


type onUploadProgress = (formatSpeed: string, percentComplete: number) => void;

export const getQiniuToken = async (type: string) => (
  request.get<string>('/api/file/token', {
    params: {
      type,
    },
  })
);

export const upload = async (formData: FormData, onUploadProgress: onUploadProgress) => {
  let taking: number;
  const startDate = new Date().getTime();
  return request.post('http://up.qiniu.com', formData, {
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
        onUploadProgress(formatSpeed, percentComplete);
      }
    },
  });
};
