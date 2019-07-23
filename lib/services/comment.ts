import { CommentEntity } from '@lib/common/interfaces/comment';
import { ListRequest } from '@lib/common/interfaces/global';
import { request } from '@lib/common/utils/request';
import { ID } from '@typings/types';

export const getPictureComment = async (id: ID) =>
  request.get<ListRequest<CommentEntity[]>>(`/api/picture/${id}/comments`);

export const addComment = async (content: string, pictureId: ID) =>
  request.post<CommentEntity>(`/api/picture/${pictureId}/comment`, {
    content,
  });
