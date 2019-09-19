import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { request } from '@lib/common/utils/request';
import { likePicture, unlikePicture } from '@lib/services/picture';
import { action, observable } from 'mobx';
import { UserType } from '@common/enum/router';
import { ListStore } from '../base/ListStore';

export class UserScreenPictureList extends ListStore<PictureEntity> {
  public cacheList: Record<string, IPictureListRequest> = {};

  @observable public username = '';

  @observable public type?: UserType;

  constructor() {
    super();
    this.initQuery();
  }

  @action
  public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
  }

  public getList = async (username: string, type?: UserType, headers?: any) => {
    this.type = type;
    this.username = username;
    this.initQuery();
    const { data } = await request.get<IPictureListRequest>(
      `/api/user/${username}/picture/${this.type || ''}`,
      { headers: headers || {}, params: this.listQuery },
    );
    this.setData(data);
    this.setCache(username, type, {
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
      `/api/user/${this.username}/picture/${this.type || ''}`,
      {
        params: {
          ...this.listQuery,
          page,
        },
      },
    );
    this.setData(data, true);
    this.setCache(this.username, this.type, {
      ...data,
      data: this.list,
    });
  }

  @action public setData = (data: IPictureListRequest, plus = false) => {
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

  public setCache = (username: string, type: UserType | undefined, data: IPictureListRequest) => {
    this.cacheList[`${username}-${type || ''}`] = data;
  }

  public getCache = (username: string, type: UserType | undefined) => {
    if (this.cacheList[`${username}-${type || ''}`]) {
      this.setData(this.cacheList[`${username}-${type || ''}`]);
    }
  }

  public isCache = (
    username: string,
    type: UserType | undefined,
  ) => this.cacheList[`${username}-${type || ''}`] !== undefined;

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
