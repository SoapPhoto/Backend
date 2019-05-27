import { action, observable, reaction } from 'mobx';
import uniqid from 'uniqid';

import { IPictureListRequest, PictureEntity } from '@pages/common/interfaces/picture';
import { request } from '@pages/common/utils/request';
import { BaseStore } from './BaseStore';

interface IBaseQuery {
  page: number;
  pageSize: number;
  timestamp: number;
  [key: string]: number | string;
}

export class PictureStore extends BaseStore {
  @observable public loading = true;
  @observable public init = false;
  @observable public list: PictureEntity[] = [];
  @observable public updateKey = uniqid();
  @observable public listQuery: IBaseQuery = {
    page: 1,
    pageSize: 30,
    timestamp: Number(Date.parse(new Date().toISOString())),
  };
  @observable public count: number = 0;

  @action public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: 30,
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
  }

  @action
  public getList = async (query?: IBaseQuery, headers?: any) => {
    if (!query) {
      this.initQuery();
    }
    this.init = true;
    const { data } = await request.get<IPictureListRequest>('/api/picture', {
      headers: headers || {},
      params: {
        ...this.listQuery,
        ...query,
      },
    });
    this.setData(data);
  }

  @action
  public setData = (data: IPictureListRequest) => {
    this.list = data.data;
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
        this.updateKey = uniqid();
        console.error(err);
      });
    this.updateKey = uniqid();
  }
}
