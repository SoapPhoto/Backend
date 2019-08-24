import { createContext } from 'react';

import { WithT } from 'i18next';

const defaultContext: WithT = {
  t: () => 'error' as any,
};

export const I18nContext = createContext<WithT>(defaultContext);
