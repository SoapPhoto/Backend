import { action, observable } from 'mobx';

import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { UserType } from '@common/enum/router';
import { queryToMobxObservable } from '@lib/common/apollo';
import { UserPictures } from '@lib/schemas/query';
import { IBaseQuery } from '@lib/common/interfaces/global';
import { ListStore } from '../base/ListStore';

interface IUserPicturesGqlReq {
  userPicturesByName: IPictureListRequest;
}

export class UserScreenPictureList extends ListStore<PictureEntity, IUserPicturesGqlReq> {
  public listInit = false

  @observable public username = '';

  @observable public type!: UserType;

  private listQueryCache: Record<string, IBaseQuery> = {}

  constructor() {
    super();
  }

  public getType = (type: UserType) => (type === 'like' ? 'LIKED' : 'MY');

  @action
  public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
    if (this.username) {
      this.listQueryCache[`${this.username}:${this.type}`] = this.listQuery;
    }
  }

  public getList = async (username: string, type: UserType, query?: Partial<IBaseQuery>, plus?: boolean) => {
    this.type = type;
    this.username = username;
    const isCache = this.setListQuery();
    if (!isCache || plus) {
      await queryToMobxObservable(this.client.watchQuery<IUserPicturesGqlReq>({
        query: UserPictures,
        variables: {
          username,
          ...this.listQuery,
          ...query,
          type: this.getType(type),
        },
        fetchPolicy: 'cache-and-network',
      }), (data) => {
        this.listInit = true;
        this.setData(data.userPicturesByName, plus);
      });
    } else {
      this.getCache(username, type);
    }
  }

  public setListQuery = () => {
    const label = `${this.username}:${this.type}`;
    const data = this.listQueryCache[label];
    if (data) {
      this.listQuery = data;
      return true;
    }
    this.initQuery();
    return false;
  }

  public getPageList = async () => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    await this.getList(this.username, this.type, { page }, true);
  }

  @action public getCache = async (username: string, type: UserType) => {
    this.username = username;
    this.type = type;
    this.setListQuery();
    try {
      const data = this.client.readQuery<IUserPicturesGqlReq>({
        query: UserPictures,
        variables: {
          username,
          ...this.listQuery,
          page: 1,
          type: this.getType(type),
        },
      });
      if (!data) {
        await this.getList(username, type);
      } else {
        this.setData(data.userPicturesByName);
      }
    } catch (err) {
      await this.getList(username, type);
    }
  }

  @action public setData = (data: IPictureListRequest, plus = false) => {
    if (plus) {
      console.log(421414124);
      this.list = this.list.concat(data.data);
      this.setPlusListCache(UserPictures, 'userPicturesByName', data, {
        type: this.getType(this.type),
        username: this.username,
      });
    } else {
      this.list = data.data;
    }
    this.count = data.count;
    this.listQuery.page = data.page;
    this.listQuery.pageSize = data.pageSize;
    this.listQuery.timestamp = data.timestamp;
  }
}
