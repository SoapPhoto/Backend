import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import * as React from 'react';

import { AccountStore } from '@pages/stores/AccountStore';
import { Icon } from './Icon';
import { LoginBtn, Logo, MenuItem, MenuWapper, RightWarpper, Wrapper } from './styles';

export const Header = inject('accountStore')(
  observer(
    ({
      accountStore,
    }) => {
      const { isLogin, userInfo } = accountStore as AccountStore;
      return (
        <Wrapper>
          <Logo>
            <Icon/>
          </Logo>
          <MenuWapper>
            <MenuItem>首页</MenuItem>
          </MenuWapper>
          <RightWarpper>
            {
              isLogin ?
              <span>{userInfo.username}</span> :
              <Link href="views/auth/login" as="login">
                <LoginBtn href="/login">登录</LoginBtn>
              </Link>
            }
          </RightWarpper>
        </Wrapper>
      );
    },
  ),
);
