import _ from 'lodash';
import { action, observable } from 'mobx';

import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';
import { BaseStore } from '../base/BaseStore';

export class UserScreenStore extends BaseStore {
  @observable public type = '';
  @observable public init = false;
  @observable public user!: UserEntity;
  @observable public username = '';
  @observable public actived = false;

  @action
  public getInit = async (username: string, type: string, headers?: any) => {
    this.username = username;
    this.type = type;
    if (!(this.init && this.username === username && this.actived)) {
      await this.getUserInfo(username, headers);
    }
    this.init = true;
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
