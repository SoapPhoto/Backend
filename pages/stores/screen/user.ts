import { action, observable } from 'mobx';

import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';
import { PictureStore } from '../PictureStore';

export class UserScreenStore extends PictureStore {
  @observable public init = false;
  @observable public user!: UserEntity;
  @observable public username = '';

  @action
  public renderTrigger = (key: string) => null

  @action
  public getInit = async (username: string, headers?: any) => {
    this.init = true;
    this.username = username;
    this.setUrl(`/api/user/${username}/picture`);
    await Promise.all([
      this.getUserInfo(username, headers),
      this.getList(undefined, headers),
    ]);
  }

  @action public getUserInfo = async (username: string, headers?: any) => {
    const { data } = await request.get<UserEntity>(`/api/user/${username}`, { headers: headers || {} });
    this.user = data;
  }
}
