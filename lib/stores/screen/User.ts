import { action, observable } from 'mobx';

import { UserEntity } from '@lib/common/interfaces/user';
import { request } from '@lib/common/utils/request';
import { UserType } from '@common/enum/router';
import { BaseStore } from '../base/BaseStore';
import { IMyMobxStore } from '../init';

const server = !!(typeof window === 'undefined');

export class UserScreenStore extends BaseStore {
  constructor() {
    super();
    if (!server) {
      this.getStore();
    }
  }

  private getStore = async () => {
    const { store } = await import('../init');
    this._store = store;
  }

  private _store!: IMyMobxStore;

  @observable public type?: UserType;

  @observable public init = false;

  @observable public user!: UserEntity;

  @observable public username = '';

  @observable public actived = false;

  @action
  public getInit = async (username: string, type?: UserType, headers?: any) => {
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
      // eslint-disable-next-line no-throw-literal
      throw {
        statusCode: 404,
        message: 'no user',
      };
    }
    if (this._store) {
      this.setCache(data.username, data);
    }
    this.user = data;
  }

  @action private setCache = (username: string, user: UserEntity) => {
    this._store.appStore.userList.set(username, user);
  }

  public hasCache = (username: string) => this._store.appStore.userList.has(username)

  @action public getCache = (username: string) => {
    if (this._store.appStore.userList.has(username)) {
      this.user = this._store.appStore.userList.get(username)!;
    }
  }
}
