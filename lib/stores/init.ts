import { AccountStore } from './AccountStore';
import { AppStore } from './AppStore';
import { I18nStore } from './i18n';
import { IScreenStore, initScreenStore } from './screen';
import { ThemeStore } from './ThemeStore';

export interface IMyMobxStore {
  i18nStore: I18nStore;
  accountStore: AccountStore;
  appStore: AppStore;
  themeStore: ThemeStore;
  screen: IScreenStore;
}
export interface IInitialStore {
  i18nStore?: Partial<I18nStore>;
  accountStore?: Partial<AccountStore>;
  themeStore?: Partial<ThemeStore>;
  screen: Partial<IScreenStore>;
}

export const store: IMyMobxStore = {
  i18nStore: new I18nStore(),
  accountStore: new AccountStore(),
  appStore: new AppStore(),
  themeStore: new ThemeStore(),
  screen: initScreenStore(),
};

export const initStore = (initialState: IInitialStore): IMyMobxStore => {
  store.i18nStore.update(initialState.i18nStore);
  store.accountStore.update(initialState.accountStore);
  store.themeStore.update(initialState.themeStore);
  store.screen.userStore.update(initialState.screen.userStore);
  store.screen.userPictureStore.update(initialState.screen.userPictureStore);
  store.screen.userCollectionStore.update(initialState.screen.userCollectionStore);
  store.screen.homeStore.update(initialState.screen.homeStore);
  store.screen.tagStore.update(initialState.screen.tagStore);
  store.screen.pictureStore.update(initialState.screen.pictureStore);
  return store;
};
