import { inject, observer } from 'mobx-react';
import * as React from 'react';

import { Link } from '@pages/routes';
import { Btns } from './Btns';
import { Icon } from './Icon';
import { Logo, MenuItem, MenuWapper, Wrapper } from './styles';

export const Header = inject('accountStore')(
  observer(
    React.memo(
      () => {
        return (
          <Wrapper>
            <Logo>
              <Link route="/">
                <a href="/"><Icon/></a>
              </Link>
            </Logo>
            <MenuWapper>
              <MenuItem>首页</MenuItem>
            </MenuWapper>
            <Btns />
          </Wrapper>
        );
      },
    ),
  ),
);
