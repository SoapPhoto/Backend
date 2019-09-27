import { action, observable, runInAction } from 'mobx';

import { queryToMobxObservable } from '@lib/common/apollo';
import { UserEntity } from '@lib/common/interfaces/user';
import { UserType } from '@common/enum/router';
import { UserInfo } from '@lib/schemas/query';
import { BaseStore } from '../base/BaseStore';

interface IUserGqlReq {
  user: UserEntity;
}

export class UserScreenStore extends BaseStore {
  @observable public type?: UserType;

  @observable public user!: UserEntity;

  @observable public username?: string;

  @observable public actived = false;

  @action
  public getInit = async (username: string, type?: UserType) => {
    runInAction(() => {
      this.username = username;
      this.type = type;
    });
    await this.getUserInfo(username);
  }

  @action public getUserInfo = async (username: string) => {
    await queryToMobxObservable(this.client.watchQuery<IUserGqlReq>({
      query: UserInfo,
      variables: { username },
      fetchPolicy: 'cache-and-network',
    }), (data) => {
      runInAction(() => this.user = data.user);
    });
  }

  @action public getCache = async (username: string) => {
    const data = this.client.readQuery<IUserGqlReq>({
      query: UserInfo,
      variables: { username },
    });
    if (!data) {
      await this.getUserInfo(username);
    } else {
      runInAction(() => this.user = data.user);
    }
  }
}
