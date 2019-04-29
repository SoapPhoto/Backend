import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import * as React from 'react';

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
              <Link href="views/index" as="/">
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
