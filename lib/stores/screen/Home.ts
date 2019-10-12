import { action, observable, runInAction } from 'mobx';
import dayjs from 'dayjs';

import { IBaseQuery } from '@lib/common/interfaces/global';
import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { Pictures, NewPictures } from '@lib/schemas/query';
import { queryToMobxObservable } from '@lib/common/apollo';
import { uniqBy } from 'lodash';
import { ListStore } from '../base/ListStore';

interface IPictureGqlReq {
  pictures: IPictureListRequest;
}
interface INewPictureGqlReq {
  newPictures: IPictureListRequest;
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
      timestamp: this.init ? this.listQuery.timestamp : this.getNowDate(),
    };
  }

  @action
  public getList = async (query?: Partial<IBaseQuery>, plus = false) => {
    if (!plus && !this.listInit) {
      this.initQuery();
    }
    const get = async () => {
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
    };
    if (!this.listInit || plus) {
      await get();
    } else {
      // 不是初始化列表或者下拉加载的话，就直接获取缓存
      try {
        const cacheData = this.client.readQuery<IPictureGqlReq>({
          query: Pictures,
          variables: {
            ...this.listQuery,
            page: 1,
          },
        });
        this.list = cacheData!.pictures.data;
        if (this.list.length > 0) {
          this.getNewPictures(cacheData!, query);
        }
      } catch {
        // 假如获取缓存出现问题就强制重新获取列表
        this.listInit = false;
        await this.getList();
      }
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

  public getNewPictures = (cache: IPictureGqlReq, query?: Partial<IBaseQuery>) => {
    queryToMobxObservable(this.client.watchQuery<INewPictureGqlReq>({
      query: NewPictures,
      variables: {
        ...this.listQuery,
        timestamp: this.getNowDate(),
        lastTimestamp: dayjs(this.list[0].createTime).valueOf(),
        ...query,
      },
      fetchPolicy: 'network-only',
    }), req => runInAction(() => {
      const { count, timestamp, data } = req.newPictures;
      if (count > 1) {
        this.listQuery.timestamp = timestamp;
        this.list = uniqBy(data.concat(this.list), 'id');
        cache.pictures.data = this.list;
        cache.pictures.timestamp = timestamp;
        this.client.writeQuery<IPictureGqlReq>({
          query: Pictures,
          variables: {
            ...this.listQuery,
            page: 1,
          },
          data: cache,
        });
      }
    }));
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

  public getNowDate = () => Number(Date.parse(new Date().toISOString()))
}
