import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import * as React from 'react';

import { AccountStore } from '@pages/stores/AccountStore';
import { RightWarpper } from './styles';

export interface IProps {
  accountStore?: AccountStore;
}

export const Btns: React.SFC<IProps> = inject('accountStore')(
  observer(
    ({ accountStore }) => {
      const { isLogin, userInfo } = accountStore;
      if (isLogin) {
        return (
          <RightWarpper>
            <div>{userInfo.username}</div>
          </RightWarpper>
        );
      }
      return (
        <RightWarpper>
          <Link href="views/auth/login" as="login">
            <a href="/login">登录</a>
          </Link>
        </RightWarpper>
      );
    },
  ),
);
