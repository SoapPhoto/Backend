import { PictureEntity } from '@lib/common/interfaces/picture';
import { request } from '@lib/common/utils/request';

export const likePicture = async (id: string | number) =>
  request.put<{ count: number, isLike: boolean }>(`/api/picture/like/${id}`);

export const getPicture = async (id: string | number, headers?: any) =>
  request.get<PictureEntity>(`/api/picture/${id}`, { headers });
