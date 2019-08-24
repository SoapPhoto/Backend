import React, { ReactNode } from 'react';

import { withTranslation } from '@common/i18n';
import { WithTranslation } from 'react-i18next';
import { I18nContext } from './I18nContext';
import { Namespace } from './Namespace';

interface IChildrenProps {
  children: ReactNode;
}

const RawProvider = ({ children, ...i18nProps }: IChildrenProps & WithTranslation) => (
  <I18nContext.Provider value={i18nProps}>{children}</I18nContext.Provider>
);

interface IProviderProps {
  namespaces: Namespace[] | Namespace;
}

export const I18nProvider = ({
  children,
  namespaces,
}: IChildrenProps & IProviderProps) => {
  const Component = withTranslation(namespaces)(RawProvider);

  return <Component>{children}</Component>;
};
