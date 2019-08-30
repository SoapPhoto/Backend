import { Request } from 'express';
import cookie from 'js-cookie';
import format from 'string-format';
import _ from 'lodash';
import dayjs from 'dayjs';

import { LocaleType, LocaleTypeValues } from '@common/enum/locale';
import { request } from '@lib/common/utils/request';
import { server } from '@lib/common/utils';
import { I18nNamespace } from './Namespace';
import { II18nValue } from './I18nProvider';
import { TFunction } from './interface';


let globalValue: RecordPartial<I18nNamespace, any> = {};

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
  } catch (err) {
    console.error('fetchI18n Error:', err);
    return {};
  }
};

export const initLocale = async (namespacesRequired: I18nNamespace[] = [], req?: Request): Promise<II18nValue> => {
  let locale = LocaleType['zh-CN'];
  if (server && req) {
    locale = req.locale;
    if (LocaleTypeValues.includes(req.cookies.locale)) {
      locale = req.cookies.locale;
    }
  } else if (cookie.get('locale') && LocaleTypeValues.includes(cookie.get('locale') as LocaleType)) {
    locale = cookie.get('locale') as LocaleType;
  }
  const noFetch = namespacesRequired.filter((v) => {
    if (!currentNamespace.has(v)) {
      currentNamespace.add(v);
      return true;
    }
    return false;
  });
  const data = await fetchI18n(locale, noFetch);
  const value = {
    ...globalValue,
    ...data,
  };
  globalValue = value;
  return {
    namespacesRequired,
    locale,
    value,
    currentNamespace: [...currentNamespace],
  };
};

export const initI18n = (value: II18nValue) => {
  Object.keys(value.value).map(v => globalValue[v as I18nNamespace] = (value.value as any)[v]);
  value.namespacesRequired.forEach(v => currentNamespace.add(v));
  return value;
};

export const getT = (
  data: Pick<II18nValue, 'namespacesRequired' | 'value'>,
  value: string,
  ...arg: Array<({ [k: string]: any } | string)>
) => {
  let title = value;
  // eslint-disable-next-line no-restricted-syntax
  for (const type of data.namespacesRequired) {
    if (type) {
      const v = _.get(data.value, `${type}.${value}`);
      if (v && typeof v === 'string') {
        title = format(v, ...arg);
        break;
      }
    }
  }
  return title;
};

export const t: TFunction = (...arg) => getT(
  { namespacesRequired: [...currentNamespace], value: globalValue },
  ...arg,
);
