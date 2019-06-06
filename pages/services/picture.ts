import { request } from '@pages/common/utils/request';

export const likePicture = async (id: string | number) =>
  request.put(`/api/picture/like/${id}`);
