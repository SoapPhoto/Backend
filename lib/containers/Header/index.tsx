import { WithRouterProps } from 'next/dist/client/with-router';
import { withRouter } from 'next/router';
import React from 'react';

import { connect } from '@lib/common/utils/store';
import { ThemeStore } from '@lib/stores/ThemeStore';
import A from '@lib/components/A';
import { Btns } from './Btns';
import { Icon } from './Icon';
import { Logo, MenuWapper, Wrapper } from './styles';

interface IProps extends WithRouterProps {
  themeStore?: ThemeStore;
}

export const Header = withRouter<IProps>(
  connect('themeStore')(
    ({ router, themeStore }) => {
      const isLog = /^\/views\/auth\//.test(router!.pathname);
      return (
        <Wrapper login={isLog}>
          <Logo>
            <A style={{ fontSize: 0 }} route="/">
              <Icon
                color={themeStore!.themeData.layout.header.logo}
              />
            </A>
          </Logo>
          <MenuWapper>
            {/* <MenuItem>首页</MenuItem> */}
          </MenuWapper>
          {
            !isLog
            && <Btns />
          }
        </Wrapper>
      );
    },
  ),
);
