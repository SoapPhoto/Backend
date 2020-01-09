import { PictureEntity, UpdatePictureDot } from '@lib/common/interfaces/picture';
import { request } from '@lib/common/utils/request';

export const likePicture = async (id: number) => (
  request.put<{ count: number; isLike: boolean }>(`/api/picture/like/${id}`)
);

export const unlikePicture = async (id: number) => (
  request.put<{ count: number; isLike: boolean }>(`/api/picture/unlike/${id}`)
);

export const getPicture = async (id: number, headers?: any) => (
  request.get<PictureEntity>(`/api/picture/${id}`, { headers })
);

export const updatePicture = async (id: number, data: UpdatePictureDot, headers?: any) => (
  request.put<PictureEntity>(`/api/picture/${id}`, data, { headers })
);

export const deletePicture = async (id: number) => (
  request.delete<PictureEntity>(`/api/picture/${id}`)
);

export const imageClassify = async (base64: string) => {
  const params = new URLSearchParams();
  params.append('image', base64);
  return request.post('/api/picture/imageClassify', {
    image: base64,
  });
};
