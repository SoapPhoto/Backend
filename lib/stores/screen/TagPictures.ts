import { action, observable } from 'mobx';

import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { TagPictures } from '@lib/schemas/query';
import { IBaseQuery } from '@lib/common/interfaces/global';
import { ListStore } from '../base/ListStore';

interface ITagPicturesGqlReq {
  tagPictures: IPictureListRequest;
}

export class TagScreenPictureList extends ListStore<PictureEntity, ITagPicturesGqlReq> {
  @observable public name = '';


  public query = TagPictures

  public type = 'TAG'

  public getList = async (name: string, query?: Partial<IBaseQuery>, noCache?: boolean, plus?: boolean) => {
    this.name = decodeURI(name);
    await this.baseGetList(this.name, {
      name: decodeURI(name),
      ...this.listQuery,
      ...query,
    }, {
      success: data => this.setData(data.tagPictures, plus),
      cache: () => this.getCache(name),
    }, noCache, plus);
  }

  public getPageList = async () => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    await this.getList(this.name, { page }, false, true);
  }

  @action public getCache = async (name: string) => {
    this.name = decodeURI(name);
    this.setListQuery(decodeURI(name));
    await this.baseGetCache(this.name, {
      name: this.name,
      ...this.listQuery,
    }, {
      getList: async () => this.getList(name, {}, true),
      setData: ({ tagPictures }) => this.setData(tagPictures),
    });
  }

  @action public setData = (data: IPictureListRequest, plus = false) => {
    if (plus) {
      this.list = this.list.concat(data.data);
      this.setPlusListCache(TagPictures, 'tagPictures', data, {
        name: decodeURI(this.name),
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
