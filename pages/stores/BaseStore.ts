import { mergeStore } from '@pages/common/utils/store';
import { action } from 'mobx';

export class BaseStore {
  /**
   * 初始化替换状态
   *
   * @memberof BaseStore
   */
  @action
  public update = (store?: Partial<this>) => {
    if (store) {
      mergeStore(this, store);
    }
  }

}
