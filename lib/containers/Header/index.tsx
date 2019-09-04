import { WithRouterProps } from 'next/dist/client/with-router';
import React, { memo } from 'react';
import { rem } from 'polished';

import { ThemeStore } from '@lib/stores/ThemeStore';
import { A } from '@lib/components/A';
import { useRouter } from '@lib/router';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { css } from 'styled-components';
import { Btns } from './Btns';
import { Icon } from './Icon';
import { Logo, MenuWapper, Wrapper } from './styles';

interface IProps extends WithRouterProps {
  themeStore?: ThemeStore;
}

export const Header = memo(() => {
  const { pathname } = useRouter();
  const { layout } = useTheme();
  const isLog = /^\/views\/auth\//.test(pathname);
  return (
    <>
      <Wrapper login={isLog}>
        <Logo>
          <A style={{ fontSize: 0 }} route="/">
            <Icon
              color={layout.header.logo}
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
      {
        !isLog && (
          <div css={css`height: ${rem(70)};`} />
        )
      }
    </>
  );
});
