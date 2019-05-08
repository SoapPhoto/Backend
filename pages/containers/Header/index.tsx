import { inject, observer } from 'mobx-react';
import { withRouter, WithRouterProps } from 'next/router';
import * as React from 'react';

import { Link } from '@pages/routes';
import { ThemeStore } from '@pages/stores/ThemeStore';
import { Btns } from './Btns';
import { Icon } from './Icon';
import { Logo, MenuWapper, Wrapper } from './styles';

interface IProps extends WithRouterProps {
  themeStore?: ThemeStore;
}

export const Header = withRouter(
  inject('themeStore')(
    observer(
      React.memo<IProps>(
        ({ router, themeStore }) => {
          const isLog = /^\/views\/auth\//.test(router!.pathname);
          return (
            <Wrapper login={isLog}>
              <Logo>
                <Link route="/">
                  <a href="/">
                    <Icon
                      color={themeStore!.themeData.header.logo}
                    />
                  </a>
                </Link>
              </Logo>
              <MenuWapper>
                {/* <MenuItem>首页</MenuItem> */}
              </MenuWapper>
              {
                !isLog &&
                <Btns />
              }
            </Wrapper>
          );
        },
      ),
    ),
  ),
);
