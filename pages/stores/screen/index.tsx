import { HomeScreenStore } from './Home';
import { UserScreenStore } from './User';

export const ScreenStore = {
  homeStore: new HomeScreenStore(),
  userStore: new UserScreenStore(),
};
