import { request } from '@lib/common/utils/request';


export const getCollection = async (id: ID) => (
  request.put<{ count: number; isLike: boolean }>(`/api/collection/${id}`)
);
