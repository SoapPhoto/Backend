import { HomeScreenStore } from './Home';
import { PictureScreenStore } from './Picture';
import { TagScreenStore } from './Tag';
import { UserScreenStore } from './User';
import { UserScreenPictureList } from './UserList';
import { UserScreenCollectionList } from './UserCollections';
import { CollectionScreenStore } from './Collection';

export interface IScreenStore {
  homeStore: HomeScreenStore;
  userStore: UserScreenStore;
  userPictureStore: UserScreenPictureList;
  userCollectionStore: UserScreenCollectionList;
  tagStore: TagScreenStore;
  pictureStore: PictureScreenStore;
  collectionStore: CollectionScreenStore;
}

export const initScreenStore = (): IScreenStore => ({
  homeStore: new HomeScreenStore(),
  userStore: new UserScreenStore(),
  userPictureStore: new UserScreenPictureList(),
  userCollectionStore: new UserScreenCollectionList(),
  tagStore: new TagScreenStore(),
  pictureStore: new PictureScreenStore(),
  collectionStore: new CollectionScreenStore(),
});
