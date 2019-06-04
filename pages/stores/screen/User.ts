import { action, observable } from 'mobx';

import { IBaseQuery } from '@pages/common/interfaces/global';
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

  @observable public pictureInfo?: PictureStore;
  @observable public likeInfo?: UserLikeStore;

  // 喜欢列表的一些数据
  @observable public likeList: PictureEntity[] = [];
  @observable public likeListQuery!: IBaseQuery;
  @observable public likeInit = false;

  @action
  public getInit = async (username: string, type: string, headers?: any) => {
    this.init = true;
    this.username = username;

    let getList;
    if (type === 'like') {
      this.likeInfo = new UserLikeStore();
      getList = this.likeInfo.getList(username, undefined, headers);
    } else {
      this.pictureInfo = new PictureStore();
      this.pictureInfo.setUrl(`/api/user/${username}/picture`);
      getList = this.pictureInfo.getList(undefined, headers);
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
}
