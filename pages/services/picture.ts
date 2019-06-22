import { PictureEntity } from '@pages/common/interfaces/picture';
import { request } from '@pages/common/utils/request';

export const likePicture = async (id: string | number) =>
  request.put(`/api/picture/like/${id}`);

export const getPicture = async (id: string | number, headers?: any) =>
  request.get<PictureEntity>(`/api/picture/${id}`, { headers });
