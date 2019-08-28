import { createContext } from 'react';

import { II18nValue } from './I18nProvider';
import { TFunction } from './interface';

export interface II18nContext extends II18nValue {
  t: TFunction;
}

const defaultContext: any = {
  t: () => '' as any,
};

export const I18nContext = createContext<II18nContext>(defaultContext);
