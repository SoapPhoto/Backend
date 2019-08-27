import { $enum } from 'ts-enum-util';

export enum LocaleType {
  en = 'en',
  'zh-CN' = 'zh-CN'
}

export const LocaleTypeValues = $enum(LocaleType).map(key => LocaleType[key]);
