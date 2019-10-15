import { action, observable } from 'mobx';

import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { UserType } from '@common/enum/router';
import { UserPictures } from '@lib/schemas/query';
import { IBaseQuery } from '@lib/common/interfaces/global';
import { ListStore } from '../base/ListStore';

interface IUserPicturesGqlReq {
  userPicturesByName: IPictureListRequest;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface

export class UserScreenPictureList extends ListStore<PictureEntity, IUserPicturesGqlReq, {}, UserType> {
  public listInit = false

  public query = UserPictures

  @observable public username = '';

  public getType = () => (this.type === 'like' ? 'LIKED' : 'MY');

  public getList = async (username: string, type: UserType, query?: Partial<IBaseQuery>, noCache?: boolean, plus?: boolean) => {
    this.type = type;
    this.username = username;
    await this.baseGetList(username, {
      username,
      type: this.getType(),
      ...this.listQuery,
      ...query,
    }, {
      success: data => this.setData(data.userPicturesByName, plus),
      cache: () => this.getCache(username, type),
    }, noCache, plus);
  }

  public getPageList = async () => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    await this.getList(this.username, this.type, { page }, false, true);
  }

  @action public getCache = async (username: string, type: UserType) => {
    this.username = username;
    this.type = type;
    await this.baseGetCache(username, {
      username,
      type: this.getType(),
      ...this.listQuery,
    }, {
      getList: async () => this.getList(username, type, {}, true),
      setData: ({ userPicturesByName }) => this.setData(userPicturesByName),
    });
  }

  @action public setData = (data: IPictureListRequest, plus = false) => {
    if (plus) {
      this.list = this.list.concat(data.data);
      this.setPlusListCache(UserPictures, 'userPicturesByName', data, {
        type: this.getType(),
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
