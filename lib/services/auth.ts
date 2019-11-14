import { request } from '@lib/common/utils/request';
import { ValidatorEmailDto, ResetPasswordDto, NewPasswordDto } from '@lib/common/interfaces/auth';


export const validatorEmail = async (data: ValidatorEmailDto) => (
  request.post('/api/auth/validatoremail', data)
);

export const resetPassword = async (data: ResetPasswordDto) => (
  request.put('/api/auth/resetPassword', data)
);

export const newPassword = async (data: NewPasswordDto) => (
  request.put('/api/auth/newPassword', data)
);

export const resetVerifyMail = async () => (
  request.post('/api/auth/resetMail')
);
