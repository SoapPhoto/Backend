import { action, computed, observable, reaction } from 'mobx';
import uniqid from 'uniqid';

import { IBaseQuery } from '@pages/common/interfaces/global';
import { IPictureListRequest, PictureEntity } from '@pages/common/interfaces/picture';
import { request } from '@pages/common/utils/request';
import { BaseStore } from './BaseStore';

type PictureListType = 'user' | 'home';

interface IUserPictureListOptions {
  userName: string;
}

export class PictureStore extends BaseStore {
  @observable public loading = true;
  @observable public init = false;
  @observable public list: PictureEntity[] = [];
  @observable public listQuery!: IBaseQuery;
  @observable public count: number = 0;
  @observable private reqUrl = '/api/picture';

  constructor() {
    super();
    this.initQuery();
  }

  @computed get maxPage() {
    const { pageSize } = this.listQuery;
    return Math.ceil(this.count / pageSize);
  }

  @computed get isNoMore() {
    const { pageSize, page } = this.listQuery;
    const maxPage = Math.ceil(this.count / pageSize);
    return maxPage <= page;
  }

  @action public setUrl = (url: string) => {
    this.reqUrl = url;
  }

  @action public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: 30,
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
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
  @action
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
