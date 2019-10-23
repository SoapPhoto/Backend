import { action, observable } from 'mobx';

import { CollectionEntity, ICollectionListRequest } from '@lib/common/interfaces/collection';
import { queryToMobxObservable } from '@lib/common/apollo';
import { omit } from 'lodash';
import { UserCollectionsByName } from '@lib/schemas/query';
import { ListStore } from '../base/ListStore';

interface IUserCollectionsGqlReq {
  userCollectionsByName: ICollectionListRequest;
}

export class UserScreenCollectionList extends ListStore<CollectionEntity> {
  public cacheList: Record<string, ICollectionListRequest> = {};

  @observable public username = '';

  constructor() {
    super();
    this.initQuery();
  }

  @action
  public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
  }

  public getList = async (username: string) => {
    this.username = username;
    // this.initQuery();
    await queryToMobxObservable(this.client.watchQuery<IUserCollectionsGqlReq>({
      query: UserCollectionsByName,
      variables: {
        username,
        query: {
          ...omit(this.listQuery, ['timestamp']),
        },
      },
      fetchPolicy: 'cache-and-network',
    }), (data) => {
      this.setData(data.userCollectionsByName);
    });
  }

  @action public setData = (data: ICollectionListRequest, plus = false) => {
    if (plus) {
      this.list = this.list.concat(data.data);
    } else {
      this.list = data.data;
    }
    this.count = data.count;
    this.listQuery.page = data.page;
    this.listQuery.pageSize = data.pageSize;
    this.listQuery.timestamp = data.timestamp;
  }
}
