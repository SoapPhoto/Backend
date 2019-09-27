import { action, observable } from 'mobx';

import { IPictureListRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { request } from '@lib/common/utils/request';
import { likePicture, unlikePicture } from '@lib/services/picture';
import { UserType } from '@common/enum/router';
import { queryToMobxObservable } from '@lib/common/apollo';
import { UserPictures } from '@lib/schemas/query';
import { omit } from 'lodash';
import { ListStore } from '../base/ListStore';

interface IUserPicturesGqlReq {
  userPicturesByName: IPictureListRequest;
}

export class UserScreenPictureList extends ListStore<PictureEntity> {
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

  public getList = async (username: string, type?: UserType) => {
    this.type = type;
    this.username = username;
    // this.initQuery();
    await queryToMobxObservable(this.client.watchQuery<IUserPicturesGqlReq>({
      query: UserPictures,
      variables: {
        username,
        ...omit(this.listQuery, ['timestamp']),
        type: type === UserType.like ? 'LIKED' : 'MY',
      },
      fetchPolicy: 'cache-and-network',
    }), (data) => {
      this.setData(data.userPicturesByName);
    });
  }

  @action public getCache = async (username: string, type?: UserType) => {
    const data = this.client.readQuery<IUserPicturesGqlReq>({
      query: UserPictures,
      variables: {
        username,
        ...omit(this.listQuery, ['timestamp']),
        type: type === UserType.like ? 'LIKED' : 'MY',
      },
    });
    if (!data) {
      await this.getList(username, type);
    } else {
      this.setData(data.userPicturesByName);
    }
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
