import { observable, action, computed } from 'mobx';
import { merge } from 'lodash';

import { CollectionEntity, GetCollectionPictureListDto, UpdateCollectionDot } from '@lib/common/interfaces/collection';
import { getCollectionInfo, getCollectionPictureList, updateCollection } from '@lib/services/collection';
import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { HttpStatus } from '@lib/common/enums/http';
import { likePicture, unlikePicture } from '@lib/services/picture';
import { BaseStore } from '../base/BaseStore';

export class CollectionScreenStore extends BaseStore {
  public _infoCache: Record<string, CollectionEntity> = {}

  public _pictureListCache: Record<string, IPictureListRequest> = {}

  @observable public id = '';

  @observable public info?: CollectionEntity;

  @observable public list: PictureEntity[] = [];

  @observable public count = 0;

  @observable public listQuery!: GetCollectionPictureListDto;

  @action
  public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
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

  public getInfo = async (id: string, headers?: any) => {
    this.id = id;
    const { data } = await getCollectionInfo(id, headers);
    if (!data) {
      // eslint-disable-next-line no-throw-literal
      throw {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'no collection',
      };
    }
    this.setInfo(data);
    return '';
  }

  public getList = async (id: string, headers?: any) => {
    this.id = id;
    this.initQuery();
    const { data } = await getCollectionPictureList(id, this.listQuery, headers);
    this.setList(id, data);
  }

  public getPageList = async () => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    const { data } = await getCollectionPictureList(this.id, {
      ...this.listQuery,
      page,
    });
    this.setList(this.id, data, true);
  }

  public updateCollection = async (value: UpdateCollectionDot) => {
    await updateCollection(this.id, value);
    this.setInfo(merge(this.info!, value));
  }

  @action
  public setList = (id: string, data: IPictureListRequest, plus = false) => {
    if (plus) {
      this.list = this.list.concat(data.data);
    } else {
      this.list = data.data;
    }
    this.count = data.count;
    this.listQuery.page = data.page;
    this.listQuery.pageSize = data.pageSize;
    this.listQuery.timestamp = data.timestamp;
    this.setPictureCache(id, {
      ...data,
      data: this.list,
    });
  }

  @action
  public setInfo = (data: CollectionEntity) => {
    this.info = data;
    this.setInfoCache(data.id, data);
  }

  public setPictureCache = (id: string, data: IPictureListRequest) => {
    this._pictureListCache[id] = data;
  }

  public getPictureCache = (id: string) => {
    const data = this._pictureListCache[id];
    if (!data) return false;
    this.setList(id, data);
    return true;
  }

  public setInfoCache = (id: string, data: CollectionEntity) => {
    this._infoCache[id] = data;
  }

  public getInfoCache = (id: string) => {
    const data = this._infoCache[id];
    if (!data) return false;
    this.setInfo(data);
    return true;
  }

  @action
  public like = async (picture: PictureEntity) => {
    try {
      let func = unlikePicture;
      if (!picture.isLike) {
        func = likePicture;
      }
      const { data } = await func(picture.id);
      picture.isLike = data.isLike;
    // tslint:disable-next-line: no-empty
    } catch (err) {
      console.error(err);
    }
  }
}
