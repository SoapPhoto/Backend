import { PictureEntity, UpdatePictureDot } from '@lib/common/interfaces/picture';
import { request } from '@lib/common/utils/request';

export const likePicture = async (id: ID) => (
  request.put<{ count: number; isLike: boolean }>(`/api/picture/like/${id}`)
);

export const unlikePicture = async (id: ID) => (
  request.put<{ count: number; isLike: boolean }>(`/api/picture/unlike/${id}`)
);

export const getPicture = async (id: ID, headers?: any) => (
  request.get<PictureEntity>(`/api/picture/${id}`, { headers })
);


export const updatePicture = async (id: ID, data: UpdatePictureDot, headers?: any) => (
  request.put<PictureEntity>(`/api/picture/${id}`, data, { headers })
);
