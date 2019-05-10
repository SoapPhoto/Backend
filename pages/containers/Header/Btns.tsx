import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Transition } from 'react-transition-group';

import { Link } from '@pages/routes';

import { Popper } from '@pages/components/Popper';
import { AccountStore } from '@pages/stores/AccountStore';
import { ThemeStore } from '@pages/stores/ThemeStore';
import { Href, RightWarpper } from './styles';

export interface IProps {
  accountStore?: AccountStore;
  themeStore?: ThemeStore;
}

const transitionStyles = {
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
                  <div style={{...transitionStyles[state], transition: '.2s all ease'}}>
                    <span>123123123213</span>
                  </div>
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
          {content}
          <Href onClick={e => themeStore!.setTheme(themeStore!.theme === 'dark' ? 'base' : 'dark')}>theme</Href>
        </RightWarpper>
      );
    },
  ),
);
