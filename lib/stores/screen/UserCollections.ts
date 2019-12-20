import { action } from 'mobx';

import { CollectionEntity, ICollectionListRequest } from '@lib/common/interfaces/collection';
import { UserCollectionsByName } from '@lib/schemas/query';
import { ListStore } from '../base/ListStore';

interface IUserCollectionsGqlReq {
  userCollectionsByName: ICollectionListRequest;
}

export class UserScreenCollectionList extends ListStore<CollectionEntity, {username: string}> {
  constructor() {
    super({
      query: UserCollectionsByName,
      label: 'userCollectionsByName',
      restQuery: {
        username: '',
      },
    });
  }

  @action public setUsername = (username: string) => {
    console.log(username);
    this.restQuery.username = username;
  }
}
