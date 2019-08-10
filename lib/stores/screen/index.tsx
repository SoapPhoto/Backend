import { HomeScreenStore } from './Home';
import { PictureScreenStore } from './Picture';
import { TagScreenStore } from './Tag';
import { UserScreenStore } from './User';
import { UserScreenPictureList } from './UserList';
import { UserScreenCollectionList } from './UserCollections';

export const ScreenStore = {
  homeStore: new HomeScreenStore(),
  userStore: new UserScreenStore(),
  userPictureStore: new UserScreenPictureList(),
  userCollectionStore: new UserScreenCollectionList(),
  tagStore: new TagScreenStore(),
  pictureStore: new PictureScreenStore(),
};
