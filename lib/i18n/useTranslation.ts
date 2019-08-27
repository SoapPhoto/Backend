import { useContext } from 'react';

import { I18nContext } from './I18nContext';

export const useTranslation = () => {
  const data = useContext(I18nContext);

  return data;
};
