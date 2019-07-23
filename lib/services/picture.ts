import { PictureEntity } from '@lib/common/interfaces/picture';
import { request } from '@lib/common/utils/request';
import { ID } from '@typings/types';

export const likePicture = async (id: ID) =>
  request.put<{ count: number, isLike: boolean }>(`/api/picture/like/${id}`);

export const getPicture = async (id: ID, headers?: any) =>
  request.get<PictureEntity>(`/api/picture/${id}`, { headers });
