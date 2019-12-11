import { action, observable, runInAction } from 'mobx';

import { queryToMobxObservable } from '@lib/common/apollo';
import { UserEntity } from '@lib/common/interfaces/user';
import { UserInfo } from '@lib/schemas/query';
import Fragments from '@lib/schemas/fragments';
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
      if (err?.name !== 'Invariant Violation') {
        console.dir(err);
      }
      await this.getUserInfo(username);
    }
  }

  @action public setUserInfo = (user: Partial<UserEntity>) => {
    // eslint-disable-next-line no-restricted-syntax
    Object.keys(user).forEach((key) => {
      (this.user as any)[key] = (user as any)[key] as any;
    });
  }
}
