import { action, observable } from 'mobx';

import { UserEntity } from '@lib/common/interfaces/user';
import { request } from '@lib/common/utils/request';
import { UserType } from '@common/enum/router';
import { HttpStatus } from '@lib/common/enums/http';
import { BaseStore } from '../base/BaseStore';
import { IMyMobxStore } from '../init';

const server = !!(typeof window === 'undefined');

export class UserScreenStore extends BaseStore {
  @observable public type?: UserType;

  @observable public user!: UserEntity;

  @observable public username = '';

  @observable public actived = false;

  private _store!: IMyMobxStore;

  constructor() {
    super();
    if (!server) {
      this.getStore();
    }
  }

  @action public setUser = (value: UserEntity) => this.user = value;

  @action
  public getInit = async (username: string, type?: UserType, headers?: any) => {
    this.username = username;
    this.type = type;
    await this.getUserInfo(username, headers);
  }

  @action public getUserInfo = async (username: string, headers?: any) => {
    const { data } = await request.get<UserEntity>(`/api/user/${username}`, { headers: headers || {} });
    if (!data) {
      // eslint-disable-next-line no-throw-literal
      throw {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'no user',
      };
    }
    if (this._store) {
      this.setCache(data.username, data);
    }
    this.setUser(data);
  }

  @action public getCache = (username: string) => {
    if (this._store.appStore.userList.has(username)) {
      this.user = this._store.appStore.userList.get(username)!;
    }
  }

  public hasCache = (username: string) => this._store.appStore.userList.has(username)

  @action private setCache = (username: string, user: UserEntity) => {
    this._store.appStore.userList.set(username, user);
  }

  private getStore = async () => {
    const { store } = await import('../init');
    this._store = store;
  }
}
