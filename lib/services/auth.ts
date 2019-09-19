import { request } from '@lib/common/utils/request';
import { ValidatorEmailDto, ResetPasswordDto, NewPasswordDto } from '@lib/common/interfaces/auth';


export const validatorEmail = async (data: ValidatorEmailDto) => (
  request.post('/auth/validatoremail', data)
);

export const resetPassword = async (data: ResetPasswordDto) => (
  request.put('/auth/resetPassword', data)
);

export const newPassword = async (data: NewPasswordDto) => (
  request.put('/auth/newPassword', data)
);
