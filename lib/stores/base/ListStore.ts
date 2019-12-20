import { observable, action, computed } from 'mobx';
import { DocumentNode } from 'graphql';

import { IPaginationList, IBaseQuery } from '@lib/common/interfaces/global';
import { queryToMobxObservable } from '@lib/common/apollo';
import { server } from '@lib/common/utils';
import { apolloErrorLog } from '@lib/common/utils/error';
import { BaseStore } from './BaseStore';

export interface IListStoreData<Query> {
  query: DocumentNode;
  label: string;
  restQuery?: Query;
}

/**
 * 通用的列表类
 *
 * @export
 * @class ListStore
 */
export class ListStore<List, Query = any> extends BaseStore {
  @observable public init = false;

  @observable public list: List[] = [];

  // 一些可变查询
  @observable public restQuery: Query = {} as Query;

  @observable public listQuery!: IBaseQuery;

  @observable public listQueryCache: Record<string, IBaseQuery> = {};

  @observable public count = 0;

  @computed get id() {
    const values = Object.values(this.restQuery);
    if (values.length === 0) {
      return '';
    }
    return values.filter(v => !!v).join(':');
  }

  @computed get maxPage() {
    const { pageSize } = this.listQuery;
    return Math.ceil(this.count / pageSize);
  }

  @computed get isNoMore() {
    return this.count <= this.list.length;
  }

  public readonly label!: string;

  public readonly query!: DocumentNode;

  constructor({
    label,
    query,
    restQuery,
  }: IListStoreData<Query>) {
    super();
    this.label = label;
    this.query = query;
    if (restQuery) this.restQuery = restQuery;
  }

  /**
   * 获取初始化查询
   *
   * @memberof ListStore
   */
  @action public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
    if (this.id) {
      this.listQueryCache[this.id] = this.listQuery;
    }
  }

  @action public setListQuery = () => {
    const data = this.listQueryCache[this.id];
    if (data) {
      this.listQuery = data;
      return true;
    }
    this.initQuery();
    return false;
  }

  /**
   * 默认的获取数据
   *
   * @memberof PictureListStore
   */
  public getList = async (plus: boolean, noCache = false) => {
    if (!this.init || plus || server || noCache) {
      if (!plus) {
        this.setListQuery();
      }
      await queryToMobxObservable(this.client.watchQuery({
        variables: {
          ...this.restQuery,
          query: {
            ...this.listQuery,
            ...(plus ? { page: this.listQuery.page + 1 } : {}),
          },
        },
        query: this.query,
        fetchPolicy: 'cache-and-network',
      }), (data: any) => {
        this.init = true;
        this.setData(data[this.label], plus);
      });
    } else {
      await this.getListCache();
    }
  }

  public getPageList = async () => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    await this.getList(true);
  }

  // eslint-disable-next-line arrow-parens
  /**
   * 设置列表数据
   *
   * @memberof ListStore
   */
  @action public setData = (data: IPaginationList<List>, plus: boolean) => {
    if (plus) {
      this.list = this.list.concat(data.data);
      this.setPlusListCache(data);
    } else {
      this.list = data.data;
    }
    this.listQuery.page = data.page;
    this.listQuery.pageSize = data.pageSize;
    this.listQuery.timestamp = data.timestamp;
    this.count = data.count;
  }

  /**
   * 修改翻页后的列表缓存，把所有数据缓存到page=1
   *
   * @memberof ListStore
   */
  @action public setPlusListCache = (data: IPaginationList<List>) => {
    try {
      const newVar = {
        query: {
          ...this.listQuery,
          page: 1,
        },
        ...this.restQuery,
      };
      const cacheData = this.client.readQuery({
        query: this.query,
        variables: newVar,
      });
      // 以防万一
      if (cacheData) {
        cacheData[this.label].data = cacheData[this.label].data.concat(data.data);
        cacheData[this.label].page = data.page;
        cacheData[this.label].pageSize = data.pageSize;
        this.client.writeQuery({
          query: this.query,
          variables: newVar,
          data: cacheData,
        });
      }
    } catch (err) {
      apolloErrorLog(err);
    }
  }

  public getListCache = async () => {
    this.setListQuery();
    const query = {
      ...this.restQuery,
      query: {
        ...this.listQuery,
        page: 1,
      },
    };
    try {
      const data = this.client.readQuery({
        query: this.query,
        variables: query,
      });
      if (!data) {
        await this.getList(false, true);
      } else {
        this.setData(data[this.label], false);
      }
    } catch (err) {
      await this.getList(false, true);
      apolloErrorLog(err);
    }
  }
}
