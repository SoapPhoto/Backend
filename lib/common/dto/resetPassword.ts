import * as Yup from 'yup';

export const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, '请输入正确的密码')
    .max(26, '请输入正确的密码')
    .required('请输入正确的密码'),
  newPassword: Yup.string()
    .min(6, '请输入正确的密码')
    .max(26, '请输入正确的密码')
    .required('请输入正确的密码'),
  repeatPassword: Yup.string()
    .min(6, '请输入正确的密码')
    .max(26, '请输入正确的密码')
    .required('请输入正确的密码'),
});
