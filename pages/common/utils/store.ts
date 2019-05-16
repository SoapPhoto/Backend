import _ from 'lodash';
import { inject, IReactComponent, observer } from 'mobx-react';

export const mergeStore = <T>(store: T, state: Partial<T>) => {
  for (const key in state) {
    if (key) {
      if (state[key] !== null && state[key] !== undefined) {
        (store as any)[key] = state[key];
      }
    }
  }
};

export const connect = <T extends IReactComponent>(...stores: string[]) => (component: T) =>
  inject(...stores)(
    observer(component),
  );
