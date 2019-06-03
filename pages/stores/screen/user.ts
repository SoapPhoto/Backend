import { action, observable } from 'mobx';

import { NotFoundException } from '@nestjs/common';
import { IBaseQuery } from '@pages/common/interfaces/global';
import { IPictureListRequest, PictureEntity } from '@pages/common/interfaces/picture';
import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';
import { PictureStore } from '../PictureStore';

export class UserScreenStore extends PictureStore {
  @observable public type = '';
  @observable public init = false;
  @observable public user!: UserEntity;
  @observable public username = '';

  // 喜欢列表的一些数据
  @observable public likeList: PictureEntity[] = [];
  @observable public likeListQuery!: IBaseQuery;
  @observable public likeInit = false;

  @action
  public renderTrigger = (key: string) => null

  @action
  public getInit = async (username: string, type: string, headers?: any) => {
    this.init = true;
    this.username = username;
    this.setUrl(`/api/user/${username}/picture`);
    let getList;
    if (type === 'like') {
      getList = this.getLikeList(username, undefined, headers);
    } else {
      getList = this.getList(undefined, headers);
    }
    try {
      await Promise.all([
        this.getUserInfo(username, headers),
        getList,
      ]);
    } finally {
      this.type = type;
    }
  }

  @action
  public getLikeList = async (username: string, query?: Partial<IBaseQuery>, headers?: any, plus = false) => {
    if (!query) {
      this.initLikeQuery();
    }
    this.init = true;
    const { data } = await request.get<IPictureListRequest>(`/api/user/${username}/picture/like`, {
      headers: headers || {},
      params: {
        ...this.listQuery,
        ...query,
      },
    });
    this.setLikeData(data, plus);
  }

  @action public initLikeQuery = () => {
    this.likeListQuery = {
      page: 1,
      pageSize: 30,
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
  }

  @action public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: 30,
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
  }

  @action
  public setLikeData = (data: IPictureListRequest, plus: boolean) => {
    if (plus) {
      this.likeList = this.likeList.concat(data.data);
    } else {
      this.likeList = data.data;
    }
    this.likeListQuery.page = data.page;
    this.likeListQuery.pageSize = data.pageSize;
    this.likeListQuery.timestamp = data.timestamp;
    this.count = data.count;
  }

  @action public getUserInfo = async (username: string, headers?: any) => {
    const { data } = await request.get<UserEntity>(`/api/user/${username}`, { headers: headers || {} });
    this.user = data;
    throw {
      status: 404,
      message: 'no user',
    };
  }
}
