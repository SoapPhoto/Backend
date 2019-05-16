import { AccountStore } from './AccountStore';
import { AppStore } from './AppStore';
import { HomeStore } from './HomeStore';
import { ThemeStore } from './ThemeStore';
import { UserScreenStore } from './UserScreenStore';

export interface IMyMobxStore {
  accountStore: AccountStore;
  appStore: AppStore;
  themeStore: ThemeStore;
  homeStore: HomeStore;
  screen: {
    userStore: UserScreenStore,
  };
}
export interface IInitialStore {
  accountStore?: Partial<AccountStore>;
  themeStore?: Partial<ThemeStore>;
  screen: {
    userStore?: Partial<UserScreenStore>;
  };
}

export let store: IMyMobxStore = {
  accountStore: new AccountStore(),
  appStore: new AppStore(),
  themeStore: new ThemeStore(),
  homeStore: new HomeStore(),
  screen: {
    userStore: new UserScreenStore(),
  },
};

export const initStore = (initialState: IInitialStore): IMyMobxStore => {
  store.accountStore.update(initialState.accountStore);
  store.themeStore.update(initialState.themeStore);
  store.screen.userStore.update(initialState.screen.userStore);
  return store;
};
