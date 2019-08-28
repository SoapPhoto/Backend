import * as Yup from 'yup';
import { TFunction } from '@lib/i18n/interface';

export const LoginSchema = (t: TFunction) => Yup.object().shape({
  username: Yup.string()
    .min(1, t('yup_longer', t('username'), '1'))
    .max(26, t('yup_greater', t('username'), '26'))
    .required(t('yup_required', { label: t('username') })),
  password: Yup.string()
    .min(8, t('yup_longer', t('password'), '8'))
    .max(26, t('yup_greater', t('password'), '26'))
    .required(t('yup_required', { label: t('password') })),
});

export const SignUpSchema = () => Yup.object().shape({
  email: Yup.string()
    .email('请输入正确的邮箱')
    .required('请输入邮箱'),
  username: Yup.string()
    .min(1, '请输入正确的用户名')
    .max(26, '请输入正确的用户名')
    .required('请输入用户名'),
  password: Yup.string()
    .min(8, '请输入正确的密码')
    .max(26, '请输入正确的密码')
    .required('请输入密码'),
});
