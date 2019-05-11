import { action, computed, observable } from 'mobx';

import { getTheme, ThemeType } from '@pages/common/utils/themes';

export class ThemeStore {
  @observable public theme: ThemeType = 'base';

  @computed
  get themeData() {
    return getTheme(this.theme);
  }

  @action public setTheme(theme: ThemeType) {
    this.theme = theme;
  }
}
