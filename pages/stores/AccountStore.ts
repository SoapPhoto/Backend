import { computed, observable } from 'mobx';

import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';

export class AccountStore {
  @computed get isLogin() {
    return !!this.userInfo;
  }
  @observable public userInfo?: UserEntity;
  @observable public test = 1;
  constructor(store?: Partial<AccountStore>) {
    if (store) {
      this.userInfo = store.userInfo;
      if (store.test !== undefined) {
        this.test = store.test;
      }
    }
  }
  public setUserInfo = (userInfo?: UserEntity) => {
    this.userInfo = userInfo;
  }

  public login = async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');
    const data = await request.post('oauth/token', params, {
      headers: {
        Authorization: `Basic ${process.env.BASIC_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log(data.data.user);
    this.setUserInfo(data.data.user);
  }

}
