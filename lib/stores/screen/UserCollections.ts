import { action, observable } from 'mobx';

import { request } from '@lib/common/utils/request';
import { CollectionEntity, ICollectionListRequest } from '@lib/common/interfaces/collection';
import { ListStore } from '../base/ListStore';

export class UserScreenCollectionList extends ListStore<CollectionEntity> {
  public cacheList: Record<string, ICollectionListRequest> = {};

  @observable public username: string = '';

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

  public getList = async (username: string, headers: any) => {
    this.username = username;
    this.initQuery();
    const { data } = await request.get<ICollectionListRequest>(
      `/api/user/${username}/collection`,
      { headers: headers || {}, params: this.listQuery },
    );
    this.setData(data);
    this.setCache(username, {
      ...data,
      data: this.list,
    });
  }

  @action public setData = (data: ICollectionListRequest, plus: boolean = false) => {
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

  public setCache = (username: string, data: ICollectionListRequest) => {
    this.cacheList[username] = data;
  }

  public isCache = (username: string) => !!this.cacheList[username];

  public getCache = (username: string = '') => {
    const data = this.cacheList[username];
    if (data) {
      this.setData(data);
    }
  }
}
