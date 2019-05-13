import { withRouter, WithRouterProps } from 'next/router';
import * as React from 'react';

import { connect } from '@pages/common/utils/store';
import { Link } from '@pages/routes';
import { ThemeStore } from '@pages/stores/ThemeStore';
import { Btns } from './Btns';
import { Icon } from './Icon';
import { Logo, MenuWapper, Wrapper } from './styles';

interface IProps extends WithRouterProps {
  themeStore?: ThemeStore;
}

export const Header = withRouter(
  connect<React.SFC<IProps>>('themeStore')(
    ({ router, themeStore }) => {
      const isLog = /^\/views\/auth\//.test(router!.pathname);
      return (
        <Wrapper login={isLog}>
          <Logo>
            <Link route="/">
              <a href="/" onClick={() => console.log(4214124)}>
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
);
