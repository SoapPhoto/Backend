import { inject, observer } from 'mobx-react';
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
          <div>login</div>
        </RightWarpper>
      );
    },
  ),
);
