import * as Yup from 'yup';
import { TFunction } from '@lib/i18n/interface';

const baseSchema = (t: TFunction) => ({
  username: Yup.string()
    .min(1, t('validation.yup_longer', t('label.username'), '1'))
    .max(26, t('validation.yup_greater', t('label.username'), '26'))
    .required(t('validation.yup_required', t('label.username'))),
  password: Yup.string()
    .min(8, t('validation.yup_longer', t('label.password'), '8'))
    .max(26, t('validation.yup_greater', t('label.password'), '26'))
    .required(t('validation.yup_required', t('label.password'))),
});

export const LoginSchema = (t: TFunction) => Yup.object().shape({
  ...baseSchema(t),
});

export const SignUpSchema = (t: TFunction) => Yup.object().shape({
  email: Yup.string()
    .email(t('validation.yup_format', t('label.email')))
    .required(t('validation.yup_required', t('label.email'))),
  ...baseSchema(t),
});

export const CompleteUserInfoSchema = (t: TFunction) => ({
  username: Yup.string()
    .min(1, t('validation.yup_longer', t('label.username'), '1'))
    .max(26, t('validation.yup_greater', t('label.username'), '26'))
    .required(t('validation.yup_required', t('label.username'))),
});
