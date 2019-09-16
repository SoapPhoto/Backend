import { CommentEntity } from '@lib/common/interfaces/comment';
import { IListRequest } from '@lib/common/interfaces/global';
import { request } from '@lib/common/utils/request';

export const getPictureComment = async (id: ID) => (
  request.get<IListRequest<CommentEntity[]>>(`/api/picture/${id}/comments`)
);

export const addComment = async (content: string, pictureId: ID) => (
  request.post<CommentEntity>(`/api/picture/${pictureId}/comment`, {
    content,
  })
);
