import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';
import styled from 'styled-components';

import { Link } from '@pages/routes';

import { box } from '@pages/common/utils/themes/common';
import { Popper } from '@pages/components/Popper';
import { AccountStore } from '@pages/stores/AccountStore';
import { ThemeStore } from '@pages/stores/ThemeStore';
import { Href, RightWarpper } from './styles';

export interface IProps {
  accountStore?: AccountStore;
  themeStore?: ThemeStore;
}

const Wrapper = styled.section`
  ${props => box(props.theme, '100%', true)}
  max-width: 180px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 32px 0px;
`;

const transitionStyles: {
  [key in TransitionStatus]?: any
} = {
  entering: { opacity: 1, transform: 'scale(1)' },
  entered: { opacity: 1, transform: 'scale(1)' },
  exiting: { opacity: 0, transform: 'scale(.98)' },
  exited: { opacity: 0, transform: 'scale(.98)' },
};

export const Btns: React.SFC<IProps> = inject(
  (allStores: any)  => ({
    accountStore: allStores.accountStore,
    themeStore: allStores.themeStore,
  }),
)(
  observer(
    ({ accountStore, themeStore }) => {
      const [data, setData] = React.useState(false);
      const { isLogin, userInfo } = accountStore!;
      let content = (
        <Link route="/login">
          <Href href="/login">登录</Href>
        </Link>
      );
      if (isLogin && userInfo) {
        content = (
          <Popper
            transition
            visible={data}
            onClose={() => setData(false)}
            content={({ visible, close }) => (
              <Transition
                onExited={() => close()}
                in={visible}
                appear
                timeout={200}
              >
                {state => (
                  <Wrapper style={{ ...transitionStyles[state], transition: '.2s all ease' }}>
                    <span>123123123213</span>
                  </Wrapper>
                )}
              </Transition>
            )}
          >
            {/* <Link route="/setting/basic"> */}
              <Href onClick={() => setData(true)}>{userInfo.username}</Href>
            {/* </Link> */}
          </Popper>
        );
      }
      return (
        <RightWarpper>
          <Href onClick={e => themeStore!.setTheme(themeStore!.theme === 'dark' ? 'base' : 'dark')}>theme</Href>
          {content}
        </RightWarpper>
      );
    },
  ),
);
