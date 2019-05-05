import { AccountStore } from './AccountStore';
import { AppStore } from './AppStore';

export interface IMyMobxStore {
  accountStore: AccountStore;
}
export interface IInitialStore {
  accountStore?: Partial<AccountStore>;
}

export const initStore = (initialState: IInitialStore): IMyMobxStore => {
  const store = {
    accountStore: new AccountStore(initialState.accountStore),
    appStore: new AppStore(),
  };
  return store;
};
