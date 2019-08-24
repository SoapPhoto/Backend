import { useContext } from 'react';

import { I18nContext } from './I18nContext';

export const useTranslation = () => {
  const { t } = useContext(I18nContext);

  return { t };
};
