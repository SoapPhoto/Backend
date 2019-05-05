import { inject, observer } from 'mobx-react';
import * as React from 'react';

import { Link } from '@pages/routes';

import { AccountStore } from '@pages/stores/AccountStore';
import { RightWarpper } from './styles';

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
            <div>{userInfo.username}</div>
          </RightWarpper>
        );
      }
      return (
        <RightWarpper>
          <Link route="/login">
            <a href="/login">登录</a>
          </Link>
        </RightWarpper>
      );
    },
  ),
);
