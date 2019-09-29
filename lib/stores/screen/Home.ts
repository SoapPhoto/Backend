import { action, observable, runInAction } from 'mobx';

import { IBaseQuery } from '@lib/common/interfaces/global';
import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { Pictures } from '@lib/schemas/query';
import { queryToMobxObservable } from '@lib/common/apollo';
import { likePicture, unlikePicture } from '@lib/services/picture';
import { ListStore } from '../base/ListStore';

interface IPictureGqlReq {
  pictures: IPictureListRequest;
}

export class HomeScreenStore extends ListStore<PictureEntity> {
  public listInit = false

  @observable private reqUrl = '/api/picture';

  constructor() {
    super();
  }

  @action public setUrl = (url: string) => {
    this.reqUrl = url;
  }

  @action public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: this.init ? this.listQuery.timestamp : Number(Date.parse(new Date().toISOString())),
    };
  }

  @action
  public getList = async (query?: Partial<IBaseQuery>, plus = false) => {
    if (!plus && !this.listInit) {
      this.initQuery();
    }
    if (!this.listInit || plus) {
      await queryToMobxObservable(this.client.watchQuery<IPictureGqlReq>({
        query: Pictures,
        variables: {
          ...this.listQuery,
          ...query,
        },
        fetchPolicy: 'cache-and-network',
      }), (data) => {
        this.listInit = true;
        this.setData(data.pictures, plus);
      });
    } else {
      const cacheData = this.client.readQuery<IPictureGqlReq>({
        query: Pictures,
        variables: {
          ...this.listQuery,
          page: 1,
        },
      });
      if (cacheData) this.list = cacheData.pictures.data;
    }
  }

  public getPageList = async () => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    await this.getList({
      page: this.listQuery.page + 1,
    }, true);
  }

  @action
  public setData = (data: IPictureListRequest, plus: boolean) => {
    if (plus) {
      try {
        runInAction(() => {
          this.list = this.list.concat(data.data);
        });
        const cacheData = this.client.readQuery<IPictureGqlReq>({
          query: Pictures,
          variables: {
            ...this.listQuery,
            page: 1,
          },
        });
        if (cacheData) {
          cacheData.pictures.data = cacheData.pictures.data.concat(data.data);
          cacheData.pictures.page = data.page;
          cacheData.pictures.pageSize = data.pageSize;
          this.client.writeQuery<IPictureGqlReq>({
            query: Pictures,
            variables: {
              ...this.listQuery,
              page: 1,
            },
            data: cacheData,
          });
        }
      } catch (err) {
        return;
      }
    } else {
      this.list = data.data;
    }
    this.listQuery.page = data.page;
    this.listQuery.pageSize = data.pageSize;
    this.listQuery.timestamp = data.timestamp;
    this.count = data.count;
  }
}
