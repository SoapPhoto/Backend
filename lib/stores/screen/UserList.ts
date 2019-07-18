import { IBaseQuery } from '@lib/common/interfaces/global';
import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { request } from '@lib/common/utils/request';
import { likePicture } from '@lib/services/picture';
import { action, computed, observable } from 'mobx';
import { BaseStore } from '../base/BaseStore';
import { ListStore } from '../base/ListStore';

export class UserScreenPictureList extends ListStore<PictureEntity> {
  public cacheList: Record<string, IPictureListRequest> = {};

  @observable public username: string = '';
  @observable public type: string = '';

  @action
  public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
  }

  public getList = async (username: string, type: string = '', headers: any) => {
    this.type = type;
    this.username = username;
    this.initQuery();
    const { data } = await request.get<IPictureListRequest>(
      `/api/user/${username}/picture/${type}`,
      { headers: headers || {}, params: this.listQuery },
    );
    this.setData(data);
    this.setCache(this.type, {
      ...data,
      data: this.list,
    });
  }

  public getPageList = async () => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    const { data } = await request.get<IPictureListRequest>(
      `/api/user/${this.username}/picture/${this.type}`,
      {
        params: {
          ...this.listQuery,
          page,
        },
      },
    );
    this.setData(data, true);
    this.setCache(this.type, {
      ...data,
      data: this.list,
    });
  }

  @action public setData = (data: IPictureListRequest, plus: boolean = false) => {
    if (plus) {
      this.list = this.list.concat(data.data);
    } else {
      this.list = data.data;
    }
    this.count = data.count;
    this.listQuery.page = data.page;
    this.listQuery.pageSize = data.pageSize;
    this.listQuery.timestamp = data.timestamp;
  }

  public setCache = (type: string, data: IPictureListRequest) => {
    this.cacheList[type] = data;
  }

  public getCache = (type: string = '') => {
    if (this.cacheList[type]) {
      this.setData(this.cacheList[type]);
    }
  }

  public isCache = (type: string = '') => this.cacheList[type] !== undefined;

  @action
  public like = async (picture: PictureEntity) => {
    try {
      const { data } = await likePicture(picture.id);
      picture.isLike = data.isLike;
    // tslint:disable-next-line: no-empty
    } catch (err) {
      console.error(err);
    }
  }
}
