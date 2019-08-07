import { observable } from 'mobx';
import format from 'string-format';

import cn from '@lib/i18n/zh-CN';
import { BaseStore } from './base/BaseStore';


export class I18nStore extends BaseStore {
  @observable public locale = 'zh-CN';

  constructor() {
    super();
  }

  public __ = (info: string, ...rest: string[]) => {
    if ((cn as any)[info]) {
      return format((cn as any)[info], rest);
    }
    return undefined;
  }
}
