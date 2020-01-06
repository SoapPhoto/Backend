import { action, observable, runInAction } from 'mobx';

import { queryToMobxObservable, watchQueryCacheObservable } from '@lib/common/apollo';
import { UserEntity } from '@lib/common/interfaces/user';
import { UserInfo } from '@lib/schemas/query';
import { apolloErrorLog } from '@lib/common/utils/error';
import { merge } from 'lodash';
import { BaseStore } from '../base/BaseStore';

interface IUserGqlReq {
  user: UserEntity;
}

export class UserScreenStore extends BaseStore {
  @observable public type?: string;

  @observable public user!: UserEntity;

  @observable public username?: string;

  @observable public activated = false;

  constructor() {
    super();
  }

  @action
  public getInit = async (username: string, type?: string) => {
    runInAction(() => {
      this.username = username;
      this.type = type;
    });
    await this.getUserInfo(username);
  }

  @action public getUserInfo = async (username: string) => {
    let error = null;
    if (username === this.user?.username) return;
    await queryToMobxObservable(this.client.watchQuery<IUserGqlReq>({
      query: UserInfo,
      variables: { username },
      fetchPolicy: 'cache-and-network',
    }), (data) => {
      if (!data.user) error = { statusCode: 404, message: 'no_user' };
      runInAction(() => this.user = data.user);
    });
    if (error) throw error;
  }

  @action public getCache = async (username: string) => {
    try {
      const data = this.client.readQuery<IUserGqlReq>({
        query: UserInfo,
        variables: { username },
      });
      if (!data) {
        await this.getUserInfo(username);
      } else {
        runInAction(() => this.user = data.user);
      }
    } catch (err) {
      apolloErrorLog(err);
      await this.getUserInfo(username);
    }
  }

  @action public setUserInfo = (user: Partial<UserEntity>) => {
    // eslint-disable-next-line no-restricted-syntax
    Object.keys(user).forEach((key) => {
      (this.user as any)[key] = (user as any)[key] as any;
    });
  }

  @action public watch = () => watchQueryCacheObservable(this.client.watchQuery<IUserGqlReq>({
    query: UserInfo,
    variables: { username: this.username },
    fetchPolicy: 'cache-only',
  }), (data) => {
    if (data.user.username !== this.username) return;
    runInAction(() => merge(this.user, data.user));
  }, {
    observable: true,
  });
}
