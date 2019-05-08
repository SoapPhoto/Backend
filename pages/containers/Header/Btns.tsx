import { inject, observer } from 'mobx-react';
import * as React from 'react';

import { Link } from '@pages/routes';

import { AccountStore } from '@pages/stores/AccountStore';
import { Href, RightWarpper } from './styles';

export interface IProps {
  accountStore?: AccountStore;
}

export const Btns: React.SFC<IProps> = inject('accountStore')(
  observer(
    ({ accountStore }) => {
      const { isLogin, userInfo } = accountStore!;
      if (isLogin && userInfo) {
        return (
          <RightWarpper>
            <Link route="/login">
              <Href href="/login">{userInfo.username}</Href>
            </Link>
          </RightWarpper>
        );
      }
      return (
        <RightWarpper>
          <Link route="/login">
            <Href href="/login">登录</Href>
          </Link>
        </RightWarpper>
      );
    },
  ),
);
