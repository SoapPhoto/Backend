import { CommentEntity } from '@pages/common/interfaces/comment';
import { ListRequest } from '@pages/common/interfaces/global';
import { request } from '@pages/common/utils/request';

export const getPictureComment = async (id: string | number) =>
  request.get<ListRequest<CommentEntity[]>>(`/api/picture/${id}/comments`);

export const addComment = async (content: string | number, pictureId: number) =>
  request.post<CommentEntity>(`/api/picture/${pictureId}/comment`, {
    content,
  });
