import { PictureStore } from './PictureList';

import { assignStore } from '@pages/common/utils/store';

let rootStore = null;

export const initStore = (state: any) => {
  if (rootStore === null) {
    rootStore = {};
    for (const key in state) {
      if (key !== 'url') {
        switch (key) {
          case 'picture':
            rootStore[state[key].key] = assignStore(new PictureStore(), state[key]);
            break;

          default:
            break;
        }
      }
    }
  } else {
    for (const key in state) {
      if (key !== 'url') {
        switch (key) {
          case 'picture':
            assignStore(rootStore[state[key].key], state[key]);
            break;

          default:
            break;
        }
      }
    }
  }
  return rootStore;
};
