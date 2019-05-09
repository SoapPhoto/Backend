import { action, computed, observable } from 'mobx';

import { getTheme } from '@pages/common/utils/themes';

export class ThemeStore {
  @observable public theme = 'base';

  @computed
  get themeData() {
    return getTheme(this.theme);
  }

  @action public setTheme(theme) {
    this.theme = theme;
  }
}
