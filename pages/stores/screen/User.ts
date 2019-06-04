import { action, observable } from 'mobx';

import { IBaseQuery, ScreenState } from '@pages/common/interfaces/global';
import { PictureEntity } from '@pages/common/interfaces/picture';
import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';
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
      this.likeInfo = new UserLikeStore();
      runList.push(this.likeInfo.getList(username, undefined, headers));
    } else {
      this.pictureInfo = new PictureStore();
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
