import { action, observable } from 'mobx';

import { IPictureListRequest, PictureEntity } from '@pages/common/interfaces/picture';
import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';
import { BaseStore } from '../BaseStore';

export class UserScreenStore extends BaseStore {
  @observable public init = false;
  @observable public pictureList: PictureEntity[] = [] ;
  @observable public user!: UserEntity;

  @action
  public getDetail = async (username: string) => {
    this.init = true;
    const [user, picture] = await Promise.all([
      request.get<UserEntity>(`/api/user/${username}`),
      request.get<IPictureListRequest>(`/api/user/${username}/picture`),
    ]);
    this.user = user.data;
    this.pictureList = picture.data.data;
  }
}
