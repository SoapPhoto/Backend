import { action, observable, reaction } from 'mobx';

import * as NProgress from 'nprogress';

export type RouterAction = 'POP' | 'PUSH' | 'REPLACE';

interface ILocation {
  href: string;
  options?: {
    shallow?: boolean;
    [key: string]: string | boolean | number | undefined;
  };
  as: string;
  action: RouterAction;
}

export class AppStore {
  @observable public loading = false;
  @observable public location?: ILocation;

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
  public setRoute = (value: ILocation) => {
    this.location = value;
  }
}
