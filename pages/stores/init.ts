import { AccountStore } from './AccountStore';
import { AppStore } from './AppStore';
import { ThemeStore } from './ThemeStore';

export interface IMyMobxStore {
  accountStore: AccountStore;
  appStore: AppStore;
  themeStore: ThemeStore;
}
export interface IInitialStore {
  accountStore?: Partial<AccountStore>;
}

export let store: IMyMobxStore = {
  accountStore: new AccountStore(),
  appStore: new AppStore(),
  themeStore: new ThemeStore(),
};

export const initStore = (initialState: IInitialStore): IMyMobxStore => {
  store.accountStore.update(initialState.accountStore);
  return store;
};
