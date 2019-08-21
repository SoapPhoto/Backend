import { request } from '@lib/common/utils/request';

export const getQiniuToken = async (type: string) => (
  request.get<string>('/api/file/token', {
    params: {
      type,
    },
  })
);

export const upload = async (formData: FormData) => (
  request.post('http://up.qiniu.com', formData)
);
