import {
  applySnapshot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from 'mobx-state-tree';

import theme, { getTheme, ThemeType } from '@lib/common/utils/themes';

const Store = types
  .model({
    theme: types.optional(
      types.enumeration('theme', Object.keys(theme)),
      'dark',
    ),
  })
  .views(self => ({
    get themeData() {
      return {};
    },
  }));
