import * as Yup from 'yup';
import { TFunction } from '@lib/i18n/interface';

export const UpdateCollectionSchema = (t: TFunction) => Yup.object().shape({
  name: Yup.string()
    .min(1, t('validation.yup_longer', t('collection.label.name'), '1'))
    .max(30, t('validation.yup_greater', t('collection.label.name'), '30'))
    .required(t('validation.yup_required', t('collection.label.name'))),
});
