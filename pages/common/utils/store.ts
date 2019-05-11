import _ from 'lodash';
import { inject, IReactComponent, observer } from 'mobx-react';

export const assignStore = <T>(store: T, state: any): T => {
  return _.assignInWith(store, state);
};

export const connect = <T extends IReactComponent>(...stores: string[]) => (component: T) =>
  inject(...stores)(
    observer(component),
  );
