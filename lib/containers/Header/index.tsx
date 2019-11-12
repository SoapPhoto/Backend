import { WithRouterProps } from 'next/dist/client/with-router';
import React, { memo } from 'react';
import { rem } from 'polished';

import { ThemeStore } from '@lib/stores/ThemeStore';
import { A } from '@lib/components/A';
import { useRouter } from '@lib/router';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { BtnGroup } from './BtnGroup';
import { Icon } from './Icon';
import { Logo, MenuWrapper, Wrapper } from './styles';

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
        <MenuWrapper>
          {/* <MenuItem>首页</MenuItem> */}
        </MenuWrapper>
        {
          !isLog
              && <BtnGroup />
        }
      </Wrapper>
      {
        !isLog && (
          <div style={{ height: rem(70) }} />
        )
      }
    </>
  );
});
