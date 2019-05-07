import { action, observable, reaction } from 'mobx';

import * as NProgress from 'nprogress';

export type RouterAction = 'POP' | 'PUSH' | 'REPLACE';

export class AppStore {
  @observable public loading = false;
  @observable public action: RouterAction = 'POP';

  constructor() {
    reaction(
      () => this.loading,
      (loading: boolean) => {
        if (loading) {
          NProgress.start();
        } else {
          NProgress.done();
        }
      },
    );
  }

  @action
  public setLoading = (value: boolean) => this.loading = value

  @action
  public setAction = (value: RouterAction) => this.action = value
}
