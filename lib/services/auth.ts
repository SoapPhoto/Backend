import { request } from '@lib/common/utils/request';
import { ValidatorEmailDto } from '@lib/common/interfaces/auth';


export const validatorEmail = async (data: ValidatorEmailDto) => (
  request.post('/api/auth/validatoremail', data)
);
