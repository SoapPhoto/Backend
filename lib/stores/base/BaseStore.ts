import { mergeStore } from '@lib/common/utils/store';
import { action, observable } from 'mobx';
import ApolloClient from 'apollo-client';

export class BaseStore {
  public client!: ApolloClient<any>;

  @observable public isInit = false;

  public setClient = (client: ApolloClient<any>) => this.client = client;

  /**
   * 初始化替换状态
   *
   * @memberof BaseStore
   */
  @action
  public update = (store?: Partial<this>, apollo?: ApolloClient<any>) => {
    if (this.isInit) {
      return;
    }
    if (apollo) {
      this.setClient(apollo);
    }
    this.isInit = true;
    if (store) {
      mergeStore(this, store);
    }
  }
}
