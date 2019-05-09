import { inject, observer } from 'mobx-react';
import * as React from 'react';

import { Link } from '@pages/routes';

import { AccountStore } from '@pages/stores/AccountStore';
import { ThemeStore } from '@pages/stores/ThemeStore';
import { Href, RightWarpper } from './styles';

export interface IProps {
  accountStore?: AccountStore;
  themeStore?: ThemeStore;
}

export const Btns: React.SFC<IProps> = inject(
  (allStores: any)  => ({
    accountStore: allStores.accountStore,
    themeStore: allStores.themeStore,
  }),
)(
  observer(
    ({ accountStore, themeStore }) => {
      const { isLogin, userInfo } = accountStore!;
      let content = (
        <Link route="/login">
          <Href href="/login">登录</Href>
        </Link>
      );
      if (isLogin && userInfo) {
        content = (
          <Link route="/setting/basic">
            <Href href="/setting/basic">{userInfo.username}</Href>
          </Link>
        );
      }
      return (
        <RightWarpper>
          {content}
          <Href onClick={e => themeStore!.setTheme(themeStore!.theme === 'dark' ? 'base' : 'dark')}>theme</Href>
        </RightWarpper>
      );
    },
  ),
);
