import { Request } from 'express';
import cookie from 'js-cookie';

import { LocaleType, LocaleTypeValues } from '@common/enum/locale';
import { request } from '@lib/common/utils/request';
import { server } from '@lib/common/utils';
import { I18nNamespace } from './Namespace';
import { II18nValue } from './I18nProvider';

const globalValue: Map<I18nNamespace, any> = new Map();

const currentNamespace: Set<I18nNamespace> = new Set([]);

export const fetchI18n = async (locale: LocaleType, namespace: I18nNamespace | I18nNamespace[]) => {
  if (!namespace) return {};
  const name = Array.isArray(namespace) ? namespace : [namespace];
  try {
    const dataArr = await Promise.all(
      name.map(n => request.get(`/static/locales/${locale}/${n}.json`)),
    );
    const test: Record<I18nNamespace, any> = {} as any;
    dataArr.forEach(({ data }, i) => {
      test[name[i]] = data;
    });
    return test;
  } catch (_) {
    return {};
  }
};

export const initLocale = async (namespacesRequired: I18nNamespace[], req?: Request): Promise<II18nValue> => {
  let locale = LocaleType['zh-CN'];
  if (server && req) {
    locale = req.locale;
  } else if (cookie.get('locale') && LocaleTypeValues.includes(cookie.get('locale') as LocaleType)) {
    locale = cookie.get('locale') as LocaleType;
  }
  const data = await fetchI18n(locale, namespacesRequired);
  console.log(data, [...currentNamespace], { ...globalValue });
  return {
    namespacesRequired,
    locale,
    value: {},
    currentNamespace: [],
  };
};

export const initI18n = (value: II18nValue) => {
  Object.keys(value.value).map(v => globalValue.set(v as I18nNamespace, (value.value as any)[v]));
  value.namespacesRequired.forEach(v => currentNamespace.add(v));
  return value;
};
