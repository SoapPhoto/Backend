import { AccountStore } from './AccountStore';
import { AppStore } from './AppStore';
import { HomeStore } from './HomeStore';
import { ThemeStore } from './ThemeStore';

export interface IMyMobxStore {
  accountStore: AccountStore;
  appStore: AppStore;
  themeStore: ThemeStore;
  homeStore: HomeStore;
}
export interface IInitialStore {
  accountStore?: Partial<AccountStore>;
  themeStore?: Partial<ThemeStore>;
}

export let store: IMyMobxStore = {
  accountStore: new AccountStore(),
  appStore: new AppStore(),
  themeStore: new ThemeStore(),
  homeStore: new HomeStore(),
};

export const initStore = (initialState: IInitialStore): IMyMobxStore => {
  store.accountStore.update(initialState.accountStore);
  store.themeStore.update(initialState.themeStore);
  return store;
};
