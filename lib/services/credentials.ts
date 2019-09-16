import { request } from '@lib/common/utils/request';
import { CredentialsEntity } from '@server/modules/credentials/credentials.entity';
import { AuthorizeDto } from '@lib/common/interfaces/credentials';

export const getUserCredentialList = async () => (
  request.get<CredentialsEntity[]>('/api/credentials')
);

export const accountRevoke = async (id: string) => (
  request.delete<null>(`/api/credentials/${id}`)
);

export const accountAuthorize = async (data: AuthorizeDto) => (
  request.post<null>('/api/credentials/authorize', data)
);
