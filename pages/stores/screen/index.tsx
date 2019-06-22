import { HomeScreenStore } from './Home';
import { PictureScreenStore } from './Picture';
import { TagScreenStore } from './Tag';
import { UserScreenStore } from './User';

export const ScreenStore = {
  homeStore: new HomeScreenStore(),
  userStore: new UserScreenStore(),
  tagStore: new TagScreenStore(),
  pictureStore: new PictureScreenStore(),
};
