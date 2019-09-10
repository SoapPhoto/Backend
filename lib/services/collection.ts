import { request } from '@lib/common/utils/request';
import {
  CollectionEntity, CreateCollectionDot, GetCollectionPictureListDto, UpdateCollectionDot,
} from '@lib/common/interfaces/collection';
import { IListRequest } from '@lib/common/interfaces/global';
import { IPictureListRequest } from '@lib/common/interfaces/picture';

export const getUserCollection = async (username: string) => (
  request.get<IListRequest<CollectionEntity[]>>(`/api/user/${username}/collection`)
);

export const getCollectionInfo = async (id: ID, headers?: any) => (
  request.get<CollectionEntity>(`/api/collection/${id}`, { headers })
);

export const getCollectionPictureList = async (id: ID, params: GetCollectionPictureListDto, headers?: any) => (
  request.get<IPictureListRequest>(`/api/collection/${id}/pictures`, {
    headers,
    params,
  })
);

export const addPictureCollection = async (collectionId: ID, pictureId: ID) => (
  request.post(`/api/collection/${collectionId}/${pictureId}`)
);

export const removePictureCollection = async (collectionId: ID, pictureId: ID) => (
  request.delete(`/api/collection/${collectionId}/${pictureId}`)
);

export const addCollection = async (data: CreateCollectionDot) => (
  request.post<CollectionEntity>('/api/collection', data)
);

export const updateCollection = async (id: ID, data: UpdateCollectionDot) => (
  request.put(`/api/collection/${id}`, data)
);
