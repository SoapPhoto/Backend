import { AccountStore } from './AccountStore';
import { AppStore } from './AppStore';

export interface IMyMobxStore {
  accountStore: AccountStore;
  appStore: AppStore;
}
export interface IInitialStore {
  accountStore?: Partial<AccountStore>;
}

export let store: IMyMobxStore = {
  accountStore: new AccountStore(),
  appStore: new AppStore(),
};

export const initStore = (initialState: IInitialStore): IMyMobxStore => {
  store.accountStore.update(initialState.accountStore);
  return store;
};
