import { server } from '@lib/common/utils';
import ApolloClient from 'apollo-client';
import { AccountStore } from './AccountStore';
import { AppStore } from './AppStore';
import { IScreenStore, initScreenStore } from './screen';
import { ThemeStore } from './ThemeStore';
import { NotificationStore } from './notification';

// configure({ enforceActions: 'observed' });

export interface IMyMobxStore {
  accountStore: AccountStore;
  appStore: AppStore;
  themeStore: ThemeStore;
  screen: IScreenStore;
  notificationStore: NotificationStore;
}
export interface IInitialStore {
  accountStore?: Partial<AccountStore>;
  themeStore?: Partial<ThemeStore>;
  screen: Partial<IScreenStore>;
}

// eslint-disable-next-line import/no-mutable-exports
export let store: IMyMobxStore = {
  accountStore: new AccountStore(),
  appStore: new AppStore(),
  themeStore: new ThemeStore(),
  screen: initScreenStore(),
  notificationStore: new NotificationStore(),
};

export const initStore = (initialState: IInitialStore, apollo?: ApolloClient<any>): IMyMobxStore => {
  // server 需要重置一下
  if (server) {
    store = {
      accountStore: new AccountStore(),
      notificationStore: new NotificationStore(),
      appStore: new AppStore(),
      themeStore: new ThemeStore(),
      screen: initScreenStore(),
    };
  }
  store.notificationStore.setClient(apollo!);
  store.appStore.setClient(apollo!);
  store.accountStore.update(initialState.accountStore);
  store.themeStore.update(initialState.themeStore);
  store.screen.userStore.update(initialState.screen.userStore, apollo);
  store.screen.userPictureStore.update(initialState.screen.userPictureStore, apollo);
  store.screen.userCollectionStore.update(initialState.screen.userCollectionStore, apollo);
  store.screen.homeStore.update(initialState.screen.homeStore, apollo);
  store.screen.tagStore.update(initialState.screen.tagStore, apollo);
  store.screen.pictureStore.update(initialState.screen.pictureStore, apollo);
  store.screen.collectionStore.update(initialState.screen.collectionStore, apollo);
  store.screen.collectionPictureStore.update(initialState.screen.collectionPictureStore, apollo);
  store.screen.tagPictureList.update(initialState.screen.tagPictureList, apollo);
  store.screen.searchPictures.update(initialState.screen.searchPictures, apollo);
  return store;
};
