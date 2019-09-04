import * as Yup from 'yup';
import { TFunction } from '@lib/i18n/interface';

export const EditPictureSchema = (_t: TFunction) => Yup.object().shape({
  // title: Yup.string()
  //   .min(1, t('yup_longer', t('picture_title'), '1'))
  //   .max(30, t('yup_greater', t('picture_title'), '30'))
  //   .required(t('yup_required', t('picture_title'))),
});
