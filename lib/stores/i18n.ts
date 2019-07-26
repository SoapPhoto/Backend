import i18n from 'i18n';
import { observable } from 'mobx';
import format from 'string-format';

import { BaseStore } from './base/BaseStore';

import cn from '@lib/i18n/zh-CN';

export class I18nStore extends BaseStore {
  @observable public locale = 'zh-CN';
  constructor() {
    super();
  }
  public __ = (info: string, ...rest: string[]) => {
    return format((cn as any)[info], rest);
  }
}
