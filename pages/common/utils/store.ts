import * as _ from 'lodash';

export const assignStore = <T>(store: T, state: any): T => {
  return _.assignInWith(store, state);
};
