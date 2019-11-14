import { WithRouterProps } from 'next/dist/client/with-router';
import React, {
  memo, useState, useEffect, useCallback,
} from 'react';
import { rem } from 'polished';

import { ThemeStore } from '@lib/stores/ThemeStore';
import { A } from '@lib/components/A';
import { useRouter } from '@lib/router';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { useAccountStore } from '@lib/stores/hooks';
import { Status } from '@common/enum/userStatus';
import { AnimatePresence } from 'framer-motion';
import { X } from '@lib/icon';
import { css } from 'styled-components';
import Toast from '@lib/components/Toast';
import { BtnGroup } from './BtnGroup';
import { Icon } from './Icon';
import {
  Logo, MenuWrapper, Wrapper, VerifyMessage, Again, Close, verifyHeight,
} from './styles';

interface IProps extends WithRouterProps {
  themeStore?: ThemeStore;
}

export const Header = memo(() => {
  const { pathname } = useRouter();
  const { layout } = useTheme();
  const { isLogin, userInfo, resetVerifyEmail } = useAccountStore();
  const [isVerifyMessage, setVerifyMessage] = useState(false);
  const isLog = /^\/views\/auth\//.test(pathname);
  useEffect(() => {
    if (isLogin && userInfo && userInfo.status === Status.UNVERIFIED) {
      setVerifyMessage(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const reset = useCallback(async () => {
    const data = await resetVerifyEmail();
    if (data) Toast.success('邮件已发送，请查收！');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <AnimatePresence>
        {
          isVerifyMessage && (
            <VerifyMessage
              initial={{ height: rem(0) }}
              animate={{ height: rem(verifyHeight) }}
              exit={{ height: rem(0) }}
            >
              <span>邮箱未激活，请检查您的电子邮箱，激活邮箱。</span>
              <Again onClick={reset}>重新发送激活邮件</Again>
              <Close onClick={() => setVerifyMessage(false)}><X size={13} /></Close>
            </VerifyMessage>
          )
        }
      </AnimatePresence>
      <Wrapper
        login={isLog}
        style={{
          top: rem((isVerifyMessage ? verifyHeight : 0)),
        }}
      >
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
          <div css={css`
            height: ${rem(70 + (isVerifyMessage ? verifyHeight : 0))};
            transition: 0.3s height ease;
          `}
          />
        )
      }
    </>
  );
});
