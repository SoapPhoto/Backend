import _ from 'lodash';
import { action, observable } from 'mobx';

import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';
import { mergeStore } from '@pages/common/utils/store';
import { MutableRequired } from '@typings/index';
import { plainToClass } from 'class-transformer';
import { BaseStore } from '../base/BaseStore';
import { PictureStore } from '../PictureStore';
import { UserLikeStore } from './UserLike';

export class UserScreenStore extends BaseStore {
  @observable public type = '';
  @observable public init = false;
  @observable public user!: UserEntity;
  @observable public username = '';
  @observable public actived = false;

  public pictureInfo?: PictureStore;
  public likeInfo?: UserLikeStore;

  @action
  public update = (store?: Partial<this>) => {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
    if (store) {
      mergeStore(this, store);
      if (store!.pictureInfo) {
        this.pictureInfo = plainToClass(PictureStore, store!.pictureInfo);
      }
      if (store!.likeInfo) {
        this.likeInfo = plainToClass(UserLikeStore, store!.likeInfo);
      }
    }
  }

  @action
  public getInit = async (username: string, type: string, headers?: any) => {
    const runList = [];
    if (!(this.init && this.username === username && this.actived)) {
      runList.push(this.getUserInfo(username, headers));
    }
    this.init = true;
    this.username = username;

    if (type === 'like') {
      if (!this.likeInfo) {
        this.likeInfo = new UserLikeStore(username);
      }
      runList.push(this.likeInfo.getList(undefined, headers));
    } else {
      if (!this.pictureInfo) {
        this.pictureInfo = new PictureStore();
      }
      this.pictureInfo.setUrl(`/api/user/${username}/picture`);
      runList.push(this.pictureInfo.getList(undefined, headers));
    }
    try {
      await Promise.all(runList);
    } finally {
      this.type = type;
    }
  }

  @action public getUserInfo = async (username: string, headers?: any) => {
    const { data } = await request.get<UserEntity>(`/api/user/${username}`, { headers: headers || {} });
    if (!data) {
      throw {
        statusCode: 404,
        message: 'no user',
      };
    }
    this.user = data;
  }

  /**
   * 是否处于活跃状态
   *
   * @memberof UserScreenStore
   */
  @action public active = () => this.actived = true;
  @action public deactive = () => this.actived = false;

}
