import { HomeScreenStore } from './Home';
import { PictureScreenStore } from './Picture';
import { TagScreenStore } from './Tag';
import { UserScreenStore } from './User';
import { UserScreenPictureList } from './UserList';

export const ScreenStore = {
  homeStore: new HomeScreenStore(),
  userStore: new UserScreenStore(),
  userPictureStore: new UserScreenPictureList(),
  tagStore: new TagScreenStore(),
  pictureStore: new PictureScreenStore(),
};
