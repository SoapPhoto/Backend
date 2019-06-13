import { action, observable } from 'mobx';

import { IBaseQuery } from '@pages/common/interfaces/global';
import { IPictureListRequest, PictureEntity } from '@pages/common/interfaces/picture';
import { request } from '@pages/common/utils/request';
import { likePicture } from '@pages/services/picture';
import { ListStore } from './base/ListStore';

export class PictureStore extends ListStore<PictureEntity> {
  @observable private reqUrl = '/api/picture';

  constructor() {
    super();
    this.initQuery();
  }

  @action public setUrl = (url: string) => {
    this.reqUrl = url;
  }

  @action public initQuery = () => {
    this.listQuery = observable({
      page: 1,
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: Number(Date.parse(new Date().toISOString())),
    });
  }

  @action
  public getList = async (query?: Partial<IBaseQuery>, headers?: any, plus = false) => {
    if (!query) {
      this.initQuery();
    }
    this.init = true;
    const { data } = await request.get<IPictureListRequest>(this.reqUrl, {
      headers: headers || {},
      params: {
        ...this.listQuery,
        ...query,
      },
    });
    this.setData(data, plus);
  }

  public getPageList = async() => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    return this.getList({
      page: this.listQuery.page + 1,
    }, undefined, true);
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
  public like = async (data: PictureEntity) => {
    const oldData = data.isLike;
    data.isLike = !data.isLike;
    try {
      await likePicture(data.id);
    } catch (err) {
      data.isLike = oldData;
      console.error(err);
    }
  }
}
