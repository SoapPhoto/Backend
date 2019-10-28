import { action, runInAction } from 'mobx';
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

export class HomeScreenStore extends ListStore<PictureEntity, IPictureGqlReq> {
  public listInit = false

  public query = Pictures

  public type = 'home'

  constructor() {
    super();
  }

  // @action public initQuery = () => {
  //   this.listQuery = {
  //     page: 1,
  //     pageSize: Number(process.env.LIST_PAGE_SIZE),
  //     timestamp: this.init ? this.listQuery.timestamp : this.getNowDate(),
  //   };
  // }

  @action
  public getList = async (query: Partial<IBaseQuery> = {}, plus = false, noCache = false) => {
    await this.baseGetList('home', {
      query: {
        ...query,
      },
    }, {
      success: data => this.setData(data.pictures, plus),
      cache: () => this.getCache(),
    }, noCache, plus);
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
        query: {
          ...this.listQuery,
          timestamp: this.getNowDate(),
          lastTimestamp: dayjs(this.list[0].createTime).valueOf(),
          ...query,
        },
      },
      fetchPolicy: 'network-only',
    }), req => runInAction(() => {
      const { count, timestamp, data } = req.newPictures;
      if (count >= 1) {
        const newData = data.filter(v => this.list.findIndex(x => x.id === v.id) < 0);
        if (newData.length > 0) {
          this.listQuery.timestamp = timestamp;
          this.list = uniqBy(data.concat(this.list), 'id');
          cache.pictures.data = this.list;
          cache.pictures.timestamp = timestamp;
          this.client.writeQuery<IPictureGqlReq>({
            query: Pictures,
            variables: {
              query: {
                ...this.listQuery,
                page: 1,
              },
            },
            data: cache,
          });
        }
      }
    }));
  }

  @action public getCache = async () => {
    await this.baseGetCache('home', {
      query: {
        ...this.listQuery,
      },
    }, {
      getList: async () => this.getList({}, false, true),
      setData: ({ pictures }) => this.setData(pictures, false),
    });
  }

  @action
  public setData = (data: IPictureListRequest, plus: boolean) => {
    if (plus) {
      this.list = this.list.concat(data.data);
      this.setPlusListCache(Pictures, 'pictures', data);
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
