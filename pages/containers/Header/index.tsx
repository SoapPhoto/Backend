import { inject, observer } from 'mobx-react';
import * as React from 'react';

import { Btns } from './Btns';
import { Icon } from './Icon';
import { Logo, MenuItem, MenuWapper, Wrapper } from './styles';

export const Header = inject('accountStore')(
  observer(
    () => {
      return (
        <Wrapper>
          <Logo>
            <Icon/>
          </Logo>
          <MenuWapper>
            <MenuItem>首页</MenuItem>
          </MenuWapper>
          <Btns />
        </Wrapper>
      );
    },
  ),
);
