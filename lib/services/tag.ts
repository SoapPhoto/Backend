import { GetTagPictureListDto, ITagPictureListRequest, TagEntity } from '@lib/common/interfaces/tag';
import { request } from '@lib/common/utils/request';

export const tagInfo = async (name: string, headers?: any) =>
  request.get<TagEntity>(`/api/tag/${name}`, { headers });

export const tagPictureList = async (name: string, query: GetTagPictureListDto, headers?: any) =>
  request.get<ITagPictureListRequest>(`/api/tag/${name}/picture`, { headers, params: query });
