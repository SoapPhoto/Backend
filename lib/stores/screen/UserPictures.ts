import { observable } from 'mobx';

import { UserPictures } from '@lib/schemas/query';
import { IPictureListRequest } from '@lib/common/interfaces/picture';
import { ApolloClient } from 'apollo-boost';
import { UserType } from '@common/enum/router';
import { UserPictureType } from '@common/enum/picture';
import { PictureListStore } from '../base/PictureListStore';

interface IUserPicturesGqlReq {
  userPicturesByName: IPictureListRequest;
}

interface IUserPictureQuery {
  username: string;
  type: UserPictureType;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface

export class UserScreenPictureList {
  public isInit = false;

  @observable public type: UserPictureType = UserPictureType.MY;

  @observable public list!: Record<UserPictureType, PictureListStore<IUserPictureQuery>>;

  constructor() {
    this.list = {
      LIKED: new PictureListStore<IUserPictureQuery>({
        query: UserPictures,
        label: 'userPicturesByName',
        restQuery: {
          username: '',
          type: UserPictureType.LIKED,
        },
      }),
      MY: new PictureListStore<IUserPictureQuery>({
        query: UserPictures,
        label: 'userPicturesByName',
        restQuery: {
          username: '',
          type: UserPictureType.MY,
        },
      }),
      CHOICE: new PictureListStore<IUserPictureQuery>({
        query: UserPictures,
        label: 'userPicturesByName',
        restQuery: {
          username: '',
          type: UserPictureType.CHOICE,
        },
      }),
    };
  }

  public getList = async (username: string, type?: UserType) => {
    this.list[this.getType(type)].restQuery.username = username;
    await this.list[this.getType(type)].getList(false);
    this.setType(type);
  }

  public getCache = async (username: string, type?: UserType) => {
    this.list[this.getType(type)].restQuery.username = username;
    await this.list[this.getType(type)].getListCache();
    this.setType(type);
  }

  public getType = (type?: UserType) => {
    const obj: Record<string, UserPictureType> = {
      [UserType.like]: UserPictureType.LIKED,
      [UserType.choice]: UserPictureType.CHOICE,
    };
    return obj[type as any] || UserPictureType.MY;
  }

  public setType = (type?: UserType) => {
    const obj: Record<string, UserPictureType> = {
      [UserType.like]: UserPictureType.LIKED,
      [UserType.choice]: UserPictureType.CHOICE,
    };
    this.type = obj[type as any] || UserPictureType.MY;
  }

  public update = (store?: Partial<this>, apollo?: ApolloClient<any>) => {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
    this.list.LIKED.update(store?.list?.LIKED, apollo);
    this.list.MY.update(store?.list?.MY, apollo);
    this.list.CHOICE.update(store?.list?.CHOICE, apollo);
    this.type = store?.type ?? UserPictureType.MY;
  }
}
