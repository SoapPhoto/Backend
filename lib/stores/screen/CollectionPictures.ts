import { action, observable } from 'mobx';

import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { CollectionPictures } from '@lib/schemas/query';
import { IBaseQuery } from '@lib/common/interfaces/global';
import { ListStore } from '../base/ListStore';

interface ICollectionPicturesGqlReq {
  collectionPictures: IPictureListRequest;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface

export class CollectionScreenPictureList extends ListStore<PictureEntity, ICollectionPicturesGqlReq> {
  public listInit = false

  @observable public id = ''

  public query = CollectionPictures

  public type = 'COLLECTION'

  public getList = async (id: string, query?: Partial<IBaseQuery>, noCache?: boolean, plus?: boolean) => {
    this.id = id;
    await this.baseGetList(id, {
      id: decodeURI(id),
      ...this.listQuery,
      ...query,
    }, {
      success: data => this.setData(data.collectionPictures, plus),
      cache: () => this.getCache(id),
    }, noCache, plus);
  }

  public getPageList = async () => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    await this.getList(this.id, { page }, false, true);
  }

  @action public getCache = async (id: string) => {
    this.id = id;
    await this.baseGetCache(id, {
      id,
      ...this.listQuery,
    }, {
      getList: async () => this.getList(id, {}, true),
      setData: ({ collectionPictures }) => this.setData(collectionPictures),
    });
  }

  @action public setData = (data: IPictureListRequest, plus = false) => {
    if (plus) {
      this.list = this.list.concat(data.data);
      this.setPlusListCache(CollectionPictures, 'collectionPictures', data, {
        id: this.id,
      });
    } else {
      this.list = data.data;
    }
    this.count = data.count;
    this.listQuery.page = data.page;
    this.listQuery.pageSize = data.pageSize;
    this.listQuery.timestamp = data.timestamp;
  }
}
