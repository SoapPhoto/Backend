import { request } from '@lib/common/utils/request';
import { UserEntity } from '@lib/common/interfaces/user';


export const getUserInfo = async (username: string) => (
  request.get<UserEntity>(`/api/user/${username}`)
);
