import { HomeScreenStore } from './Home';
import { PictureScreenStore } from './Picture';
import { TagScreenStore } from './Tag';
import { UserScreenStore } from './User';
import { UserScreenPictureList } from './UserPictures';
import { UserScreenCollectionList } from './UserCollections';
import { CollectionScreenStore } from './Collection';
import { CollectionScreenPictureList } from './CollectionPictures';
import { TagScreenPictureList } from './TagPictures';
import { SearchScreenPictures } from './Search/picture';

export interface IScreenStore {
  homeStore: HomeScreenStore;
  userStore: UserScreenStore;
  userPictureStore: UserScreenPictureList;
  userCollectionStore: UserScreenCollectionList;
  tagStore: TagScreenStore;
  pictureStore: PictureScreenStore;
  collectionStore: CollectionScreenStore;
  collectionPictureStore: CollectionScreenPictureList;
  tagPictureList: TagScreenPictureList;
  searchPictures: SearchScreenPictures;
}

export const initScreenStore = (): IScreenStore => ({
  homeStore: new HomeScreenStore(),
  userStore: new UserScreenStore(),
  userPictureStore: new UserScreenPictureList(),
  userCollectionStore: new UserScreenCollectionList(),
  tagStore: new TagScreenStore(),
  pictureStore: new PictureScreenStore(),
  collectionStore: new CollectionScreenStore(),
  collectionPictureStore: new CollectionScreenPictureList(),
  tagPictureList: new TagScreenPictureList(),
  searchPictures: new SearchScreenPictures(),
});
