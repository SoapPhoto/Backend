import { mergeStore } from '@pages/common/utils/store';
import { action, observable } from 'mobx';

export class BaseStore {
  @observable public isInit = false;
  /**
   * 初始化替换状态
   *
   * @memberof BaseStore
   */
  @action
  public update = (store?: Partial<this>) => {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
    if (store) {
      mergeStore(this, store);
    }
  }

}
