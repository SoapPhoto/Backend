import { request } from '@lib/common/utils/request';
import { CollectionEntity } from '@lib/common/interfaces/collection';
import { IListRequest } from '@lib/common/interfaces/global';

export const getUserCollection = async (username: string) => (
  request.get<IListRequest<CollectionEntity[]>>(`/api/user/${username}/collection`)
);

export const addPictureCollection = async (collectionId: ID, pictureId: ID) => (
  request.post(`/api/collection/${collectionId}/${pictureId}`)
);

export const removePictureCollection = async (collectionId: ID, pictureId: ID) => (
  request.delete(`/api/collection/${collectionId}/${pictureId}`)
);
