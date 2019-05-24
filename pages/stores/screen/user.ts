import { action, observable } from 'mobx';
import uniqid from 'uniqid';

import { IPictureListRequest, PictureEntity } from '@pages/common/interfaces/picture';
import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';
import { BaseStore } from '../BaseStore';

export class UserScreenStore extends BaseStore {
  @observable public init = false;
  @observable public pictureList: PictureEntity[] = [] ;
  @observable public user!: UserEntity;
  @observable public updateKey = uniqid();

  @action
  public renderTrigger = (key: string) => null

  @action
  public getDetail = async (username: string, headers?: any) => {
    this.init = true;
    const [user, picture] = await Promise.all([
      request.get<UserEntity>(`/api/user/${username}`, { headers: headers || {} }),
      request.get<IPictureListRequest>(`/api/user/${username}/picture`, { headers: headers || {} }),
    ]);
    this.user = user.data;
    this.pictureList = picture.data.data;
  }

  @action
  public like = (data: PictureEntity) => {
    const oldData = data.isLike;
    data.isLike = !data.isLike;
    request.put(`/api/picture/like/${data.id}`)
      .catch((err) => {
        data.isLike = oldData;
        this.updateKey = uniqid();
        console.error(err);
      });
    this.updateKey = uniqid();
  }
}
