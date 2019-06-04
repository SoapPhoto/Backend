import { action, observable } from 'mobx';

import { IBaseQuery } from '@pages/common/interfaces/global';
import { IPictureListRequest } from '@pages/common/interfaces/picture';
import { request } from '@pages/common/utils/request';
import { PictureEntity } from '@server/picture/picture.entity';
import { ListStore } from '../base/ListStore';

export class UserLikeStore extends ListStore<PictureEntity> {
  @observable public username = '';

  constructor() {
    super();
    this.initQuery();
  }

  @action
  public getList = async (
    username: string,
    query?: Partial<IBaseQuery>,
    headers?: any,
    plus = false,
  ) => {
    this.username = username;
    if (!query) {
      this.initQuery();
    }
    this.init = true;
    const { data } = await request.get<IPictureListRequest>(`/api/user/${username}/picture/like`, {
      headers: headers || {},
      params: {
        ...this.listQuery,
        ...query,
      },
    });
    this.setData(data, plus);
  }

  @action
  public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: 30,
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
  }

  @action
  public setData = (data: IPictureListRequest, plus: boolean) => {
    if (plus) {
      this.list = this.list.concat(data.data);
    } else {
      this.list = data.data;
    }
    this.listQuery.page = data.page;
    this.listQuery.pageSize = data.pageSize;
    this.listQuery.timestamp = data.timestamp;
    this.count = data.count;
  }

  @action
  public like = (data: PictureEntity) => {
    const oldData = data.isLike;
    data.isLike = !data.isLike;
    request.put(`/api/picture/like/${data.id}`)
      .catch((err) => {
        data.isLike = oldData;
        console.error(err);
      });
  }
}
