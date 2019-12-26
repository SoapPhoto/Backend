import { Request } from 'express';
import cookie from 'js-cookie';
import format from 'string-format';
import _ from 'lodash';

import { LocaleType, LocaleTypeValues } from '@common/enum/locale';
import { request } from '@lib/common/utils/request';
import { server } from '@lib/common/utils';
import { I18nNamespace } from './Namespace';
import { II18nValue } from './I18nProvider';
import { TFunction } from './interface';


let globalValue: RecordPartial<I18nNamespace, any> = {};

const defaultNamespace = [I18nNamespace.Common, I18nNamespace.Backend, I18nNamespace.Validation];

let currentNamespace: Set<I18nNamespace> = new Set([]);


// 获取i18n数据
export const fetchI18n = async (locale: LocaleType, namespace: I18nNamespace | I18nNamespace[]) => {
  if (!namespace) return {};
  const name = Array.isArray(namespace) ? namespace : [namespace];
  try {
    const url = server ? `http://127.0.0.1:${process.env.PAGE_PORT}` : process.env.URL;
    const dataArr = await Promise.all(
      name.map(n => request.get(`${url}/static/locales/${locale}/${n}.json?v=0.1.8.7`)),
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

// 服务器初始化
export const initLocale = async (namespacesRequired: I18nNamespace[] = [], req?: Request): Promise<II18nValue> => {
  let locale = LocaleType['zh-CN'];
  if (server && req) {
    // server 需要重置一下
    globalValue = {};
    currentNamespace.clear();
    locale = req.locale;
    if (LocaleTypeValues.includes(req.cookies.locale)) {
      locale = req.cookies.locale;
    }
  } else if (cookie.get('locale') && LocaleTypeValues.includes(cookie.get('locale') as LocaleType)) {
    locale = cookie.get('locale') as LocaleType;
  }
  const required = new Set([...defaultNamespace, ...namespacesRequired]);
  const noFetch: I18nNamespace[] = [];
  required.forEach((value) => {
    if (!currentNamespace.has(value)) {
      currentNamespace.add(value);
      noFetch.push(value);
    }
  });
  const data = await fetchI18n(locale, noFetch);
  const value = {
    ...globalValue,
    ...data,
  };
  globalValue = value;
  return {
    namespacesRequired: required,
    locale,
    value,
    currentNamespace,
  };
};

// 服务器端数据同步客户端
export const initI18n = (value: II18nValue) => {
  currentNamespace = new Set(value.currentNamespace);
  value.currentNamespace = currentNamespace;
  value.namespacesRequired = new Set(value.namespacesRequired);
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
  { namespacesRequired: currentNamespace, value: globalValue },
  ...arg,
);
