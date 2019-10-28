import {
  computed, observable, runInAction, action,
} from 'mobx';
import { DocumentNode } from 'graphql';

import { IBaseQuery } from '@lib/common/interfaces/global';
import { IPictureLikeRequest, PictureEntity, IPictureListRequest } from '@lib/common/interfaces/picture';
import { LikePicture, UnLikePicture } from '@lib/schemas/mutations';
import Fragments from '@lib/schemas/fragments';
import { queryToMobxObservable } from '@lib/common/apollo';
import { server } from '@lib/common/utils';
import { omit } from 'lodash';
import { BaseStore } from './BaseStore';

export class ListStore<L, V = any, Q = Record<string, any>, TYPE = string> extends BaseStore {
  @observable public init = false;

  @observable public list: L[] = [];

  @observable public listQuery!: Q & IBaseQuery;

  @observable public count = 0;

  // 主要是识别列表的type，做查询的cache
  @observable public type!: TYPE;

  @observable public listQueryCache: Record<string, Q & IBaseQuery> = {}

  // 一些可变查询
  public restQuery: Q = {} as Q;

  public query!: DocumentNode;

  public listInit = false

  @action public initQuery = (id: string) => {
    this.listQuery = {
      page: 1,
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: Number(Date.parse(new Date().toISOString())),
      ...this.restQuery,
    };
    if (id) {
      this.listQueryCache[`${id}:${this.type}`] = observable(this.listQuery);
    }
  }

  @computed get maxPage() {
    const { pageSize } = this.listQuery;
    return Math.ceil(this.count / pageSize);
  }

  @computed get isNoMore() {
    return this.count <= this.list.length;
  }

  public like = async (picture: PictureEntity) => {
    try {
      let req: IPictureLikeRequest;
      if (!picture.isLike) {
        const { data } = await this.client.mutate<{likePicture: IPictureLikeRequest}>({
          mutation: LikePicture,
          variables: {
            id: picture.id,
          },
        });
        req = data!.likePicture;
      } else {
        const { data } = await this.client.mutate<{unlikePicture: IPictureLikeRequest}>({
          mutation: UnLikePicture,
          variables: {
            id: picture.id,
          },
        });
        req = data!.unlikePicture;
      }
      const cacheData = this.client.readFragment<PictureEntity>({
        fragment: Fragments,
        fragmentName: 'PictureFragment',
        id: `Picture:${picture.id}`,
      });
      if (cacheData) {
        this.client.writeFragment<PictureEntity>({
          fragment: Fragments,
          fragmentName: 'PictureFragment',
          id: `Picture:${picture.id}`,
          data: {
            ...cacheData,
            isLike: req.isLike,
            likes: req.count,
          } as PictureEntity,
        });
      }
      runInAction(() => {
        picture.isLike = req.isLike;
        picture.likes = req.count;
      });
    // tslint:disable-next-line: no-empty
    } catch (err) {
      console.dir(err);
    }
  }

  public setPlusListCache = (query: DocumentNode, label: string, data: IPictureListRequest, variables: Record<string, any> = {}) => {
    try {
      const newVar = {
        query: {
          ...this.listQuery,
          page: 1,
        },
        ...omit(variables, ['query']),
      };
      const cacheData = this.client.readQuery({
        query,
        variables: newVar,
      });
      if (cacheData) {
        cacheData[label].data = cacheData[label].data.concat(data.data);
        cacheData[label].page = data.page;
        cacheData[label].pageSize = data.pageSize;
        this.client.writeQuery({
          query,
          variables: newVar,
          data: cacheData,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  public setListQuery = (id: string) => {
    const label = `${id}:${this.type}`;
    const data = this.listQueryCache[label];
    if (data) {
      this.listQuery = observable(data);
      return true;
    }
    this.initQuery(id);
    return false;
  }

  public baseGetList = async (
    id: string,
    variables: Record<string, any>,
    options: {
      success: (data: V) => void;
      cache: () => Promise<void>;
    },
    noCache = false,
    plus?: boolean,
  ) => {
    this.setListQuery(id);
    const query = {
      query: {
        ...this.listQuery,
        ...(variables.query || {}),
      },
      ...omit(variables, ['query']),
    };
    if (!this.listInit || plus || server || noCache) {
      await queryToMobxObservable(this.client.watchQuery<V>({
        variables: query,
        query: this.query,
        fetchPolicy: 'cache-and-network',
      }), (data: any) => {
        this.listInit = true;
        options.success(data);
      });
    } else {
      await options.cache();
    }
  }

  public baseGetCache = async (
    id: string,
    variables: Record<string, any>,
    options: {
      getList: () => Promise<void>;
      setData: (data: V) => void;
    },
  ) => {
    this.setListQuery(id);
    const query = {
      query: {
        ...this.listQuery,
        ...(variables.query || {}),
        page: 1,
      },
      ...omit(variables, ['query']),
    };
    try {
      const data = this.client.readQuery<V>({
        query: this.query,
        variables: query,
      });
      if (!data) {
        await options.getList();
      } else {
        options.setData(data);
      }
    } catch (err) {
      await options.getList();
    }
  }
}
