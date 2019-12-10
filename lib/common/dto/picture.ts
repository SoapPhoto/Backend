import * as Yup from 'yup';
import { TFunction } from '@lib/i18n/interface';

export const EditPictureSchema = (_t: TFunction) => Yup.object().shape({
  // title: Yup.string()
  //   .min(1, t('validation.yup_longer', t('label.picture_title'), '1'))
  //   .max(30, t('validation.yup_greater', t('label.picture_title'), '30'))
  //   .required(t('validation.yup_required', t('label.picture_title'))),
});
