import { action, computed, observable } from 'mobx';

import { server } from '@lib/common/utils';
import { getTheme, ThemeType } from '@lib/common/utils/themes';

export class ThemeStore {
  @observable public theme: ThemeType = 'base';

  // 用来初始化
  @action
  public update = (store?: Partial<ThemeStore>) => {
    if (store) {
      if (store.theme !== undefined) {
        this.setTheme(store.theme);
      }
    }
  }

  @computed
  get themeData() {
    return getTheme(this.theme);
  }

  @action public setTheme = (theme: ThemeType) => {
    if (!server) {
      document.cookie = `theme=${theme};`;
    }
    this.theme = theme;
  }
}
