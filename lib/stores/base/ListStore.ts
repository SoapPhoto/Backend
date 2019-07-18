import { computed, observable } from 'mobx';

import { IBaseQuery } from '@lib/common/interfaces/global';
import { BaseStore } from './BaseStore';

export class ListStore<L, Q = {}> extends BaseStore {
  @observable public init = false;
  @observable public list: L[] = [];
  @observable public listQuery!: Q & IBaseQuery;
  @observable public count: number = 0;

  constructor() {
    super();
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
}
