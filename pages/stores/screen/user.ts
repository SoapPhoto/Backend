import { action, observable } from 'mobx';

import { IPictureListRequest, PictureEntity } from '@pages/common/interfaces/picture';
import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';
import { mergeStore } from '@pages/common/utils/store';

export class UserScreenStore {
  @observable public init = false;
  @observable public pictureList: PictureEntity[] = [] ;
  @observable public user!: UserEntity;

  // 用来初始化
  @action
  public update = (store?: Partial<UserScreenStore>) => {
    if (store) {
      mergeStore(this, store);
    }
  }

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
