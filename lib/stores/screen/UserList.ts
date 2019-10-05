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

export class UserScreenPictureList extends ListStore<PictureEntity> {
  public listInit = false

  @observable public username = '';

  @observable public type?: UserType;

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

  public getList = async (username: string, type?: UserType, query?: Partial<IBaseQuery>, plus?: boolean) => {
    this.type = type;
    this.username = username;
    if (!plus && !this.listInit) {
      this.initQuery();
    }
    if (!this.listInit || plus) {
      await queryToMobxObservable(this.client.watchQuery<IUserPicturesGqlReq>({
        query: UserPictures,
        variables: {
          username,
          ...this.listQuery,
          ...query,
          type: type === UserType.like ? 'LIKED' : 'MY',
        },
        fetchPolicy: 'cache-and-network',
      }), (data) => {
        this.listInit = true;
        this.setData(data.userPicturesByName, plus);
      });
    }
  }

  public getPageList = async () => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    await this.getList(this.username, this.type, { page }, true);
  }

  @action public getCache = async (username: string, type?: UserType) => {
    console.log(123123);
    try {
      const data = this.client.readQuery<IUserPicturesGqlReq>({
        query: UserPictures,
        variables: {
          username,
          ...this.listQuery,
          type: type === UserType.like ? 'LIKED' : 'MY',
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
