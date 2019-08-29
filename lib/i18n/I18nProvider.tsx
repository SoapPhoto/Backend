import React from 'react';

import { LocaleType } from '@common/enum/locale';
import { I18nContext, II18nContext } from './I18nContext';
import { I18nNamespace } from './Namespace';
import { getT } from './utils';

export interface II18nValue {
  locale: LocaleType;
  value: RecordPartial<I18nNamespace, any>;
  namespacesRequired: I18nNamespace[];
  currentNamespace: I18nNamespace[];
}

interface IProps {
  value: II18nValue;
}

const i18n = (data: II18nValue): II18nContext => ({
  t: (value, ...arg) => getT(data, value, ...arg),
  ...data,
});

export const I18nProvider: React.FC<IProps> = ({
  children,
  value,
}) => <I18nContext.Provider value={i18n(value)}>{children}</I18nContext.Provider>;
