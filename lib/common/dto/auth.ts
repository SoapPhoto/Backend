import * as Yup from 'yup';
import { TFunction } from '@lib/i18n/interface';

const baseSchema = (t: TFunction) => ({
  username: Yup.string()
    .min(1, t('yup_longer', t('username'), '1'))
    .max(26, t('yup_greater', t('username'), '26'))
    .required(t('yup_required', t('username'))),
  password: Yup.string()
    .min(8, t('yup_longer', t('password'), '8'))
    .max(26, t('yup_greater', t('password'), '26'))
    .required(t('yup_required', t('password'))),
});

export const LoginSchema = (t: TFunction) => Yup.object().shape({
  ...baseSchema(t),
});

export const SignUpSchema = (t: TFunction) => Yup.object().shape({
  email: Yup.string()
    .email(t('yup_format', t('email')))
    .required(t('yup_required', t('email'))),
  ...baseSchema(t),
});

export const CompleteUserInfoSchema = (t: TFunction) => ({
  username: Yup.string()
    .min(1, t('yup_longer', t('username'), '1'))
    .max(26, t('yup_greater', t('username'), '26'))
    .required(t('yup_required', t('username'))),
});
