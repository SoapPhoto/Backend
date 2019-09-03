import { MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';
import { IMyMobxStore } from './init';

export const useStores = () => useContext<IMyMobxStore>(MobXProviderContext);

export const useScreenStores = () => {
  const { screen } = useStores();
  return screen;
};

export const useAccountStore = () => {
  const { accountStore } = useStores();
  return accountStore;
};
