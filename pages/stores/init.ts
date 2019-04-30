import { AccountStore } from './AccountStore';
import { AppStore } from './AppStore';

export interface IMyMobxStore {
  accountStore?: AccountStore;
}

export const initStore = (initialState: {
  accountStore: Partial<AccountStore>,
}): IMyMobxStore => {
  const store = {
    accountStore: new AccountStore(initialState.accountStore),
    appStore: new AppStore(),
  };
  return store;
};
