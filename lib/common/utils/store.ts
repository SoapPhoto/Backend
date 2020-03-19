// import { inject, observer } from 'mobx-react';

// eslint-disable-next-line arrow-parens
export const mergeStore = <T>(store: T, state: Partial<T>) => {
  const keys: any[] = Object.keys(state);
  keys.forEach((key: keyof T) => {
    if (state[key] !== null && state[key] !== undefined) {
      store[key] = state[key]!;
    }
  });
};

// export const connect = <T extends IReactComponent>(...stores: any[]) => (component: T) => inject(...stores)(
//   observer(component),
// );
