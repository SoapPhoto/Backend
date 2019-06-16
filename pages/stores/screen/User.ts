import _ from 'lodash';
import { action, observable } from 'mobx';

import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';
import { MutableRequired } from '@typings/index';
import { BaseStore } from '../base/BaseStore';
import { PictureStore } from '../PictureStore';
import { UserLikeStore } from './UserLike';

export class UserScreenStore extends BaseStore {
  @observable public type = '';
  @observable public init = false;
  @observable public user!: UserEntity;
  @observable public username = '';
  @observable public actived = false;

  @observable public pictureInfo?: PictureStore;
  @observable public likeInfo?: UserLikeStore;

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

  /**
   * 初始化列表 store
   *
   * @memberof UserScreenStore
   */
  @action public initData = () => {
    if (!(this.likeInfo instanceof UserLikeStore)) {
      if (this.type === 'like') {
        const info = new UserLikeStore(this.username);
        // tslint:disable-next-line: prefer-array-literal
        (Object.keys(info) as Array<keyof Omit<UserLikeStore, 'isNoMore' | 'maxPage'>>).forEach((value) => {
          (info as any)[value] = this.likeInfo![value];
        });
        this.likeInfo = info;
      } else {
        const info = new PictureStore();
        info.setUrl(`/api/user/${this.username}/picture`);
        // tslint:disable-next-line: prefer-array-literal
        (Object.keys(info) as Array<keyof Omit<PictureStore, 'isNoMore' | 'maxPage'>>).forEach((value) => {
          (info as any)[value] = this.pictureInfo![value];
        });
        this.pictureInfo = info;
      }
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
