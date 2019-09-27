import { action, observable, runInAction } from 'mobx';

import { IBaseQuery } from '@lib/common/interfaces/global';
import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { Pictures } from '@lib/schemas/query';
import { queryToMobxObservable } from '@lib/common/apollo';
import { likePicture, unlikePicture } from '@lib/services/picture';
import { omit } from 'lodash';
import { ListStore } from '../base/ListStore';

interface IPictureGqlReq {
  pictures: IPictureListRequest;
}

export class HomeScreenStore extends ListStore<PictureEntity> {
  @observable private reqUrl = '/api/picture';

  constructor() {
    super();
    this.initQuery();
  }

  @action public setUrl = (url: string) => {
    this.reqUrl = url;
  }

  @action public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
  }

  @action
  public getList = async (query?: Partial<IBaseQuery>, plus = false) => {
    this.init = true;
    await queryToMobxObservable(this.client.watchQuery<IPictureGqlReq>({
      query: Pictures,
      variables: {
        ...omit(this.listQuery, plus ? [] : ['timestamp']),
        ...query,
      },
      fetchPolicy: 'cache-and-network',
    }), (data) => {
      this.setData(data.pictures, plus);
    });
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
      this.list = this.list.concat(data.data);
    } else {
      this.list = data.data;
    }
    this.listQuery.page = data.page;
    this.listQuery.pageSize = data.pageSize;
    this.listQuery.timestamp = data.timestamp;
    this.count = data.count;
  }

  public like = async (picture: PictureEntity) => {
    try {
      let func = unlikePicture;
      if (!picture.isLike) {
        func = likePicture;
      }
      const { data } = await func(picture.id);
      const info = this.client.readQuery<IPictureGqlReq>({
        query: Pictures,
        variables: {
          ...this.listQuery,
        },
      });
      if (info) {
        const dataIndex = info.pictures.data.findIndex(v => v.id.toString() === picture.id.toString());
        if (dataIndex >= 0) {
          info.pictures.data[dataIndex].likes = data.count;
          info.pictures.data[dataIndex].isLike = data.isLike;
          this.client.writeQuery<IPictureGqlReq>({
            query: Pictures,
            variables: {
              ...this.listQuery,
            },
            data: info,
          });
        }
      }
      runInAction(() => {
        picture.likes = data.count;
        picture.isLike = data.isLike;
      });
    // tslint:disable-next-line: no-empty
    } catch (err) {
      console.error(err);
    }
  }
}
