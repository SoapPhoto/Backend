import { createContext } from 'react';

import { II18nValue } from './I18nProvider';

interface II18nContext extends II18nValue {
  t: (title: string) => string;
}

const defaultContext: any = {
  t: () => '' as any,
};

export const I18nContext = createContext<II18nContext>(defaultContext);
