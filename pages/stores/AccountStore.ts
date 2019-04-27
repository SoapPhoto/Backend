import { computed, observable } from 'mobx';

import { UserEntity } from '@pages/common/interfaces/user';

export class AccountStore {
  @computed get isLogin() {
    return !!this.userInfo;
  }
  @observable public userInfo?: UserEntity;
  constructor(store?: Partial<AccountStore>) {
    if (store) {
      this.userInfo = store.userInfo;
    }
  }
  public setUserInfo = (userInfo?: UserEntity) => {
    this.userInfo = userInfo;
  }
}
