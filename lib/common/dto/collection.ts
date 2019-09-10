import * as Yup from 'yup';
import { TFunction } from '@lib/i18n/interface';

export const UpdateCollectionSchema = (t: TFunction) => Yup.object().shape({
  name: Yup.string()
    .min(1, t('yup_longer', t('collection_name'), '1'))
    .max(30, t('yup_greater', t('collection_name'), '30'))
    .required(t('yup_required', t('collection_name'))),
});
