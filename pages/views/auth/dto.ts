import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(1, '请输入正确的用户名')
    .max(26, '请输入正确的用户名')
    .required('请输入正确的用户名'),
  password: Yup.string()
    .min(6, '请输入正确的密码')
    .max(26, '请输入正确的密码')
    .required('请输入正确的密码'),
});
