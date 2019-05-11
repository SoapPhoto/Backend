import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

import { Link } from '@pages/routes';

import { connect } from '@pages/common/utils/store';
import { Avatar } from '@pages/components';
import { Popper } from '@pages/components/Popper';
import { AccountStore } from '@pages/stores/AccountStore';
import { ThemeStore } from '@pages/stores/ThemeStore';
import { Menu, MenuItem, MenuItemLink } from './Menu';
import { Href, MenuProfile, RightWarpper, UserName } from './styles';

export interface IProps {
  accountStore?: AccountStore;
  themeStore?: ThemeStore;
}

const transitionStyles: {
  [key in TransitionStatus]?: any
} = {
  entering: { opacity: 1, transform: 'scale(1)' },
  entered: { opacity: 1, transform: 'scale(1)' },
  exiting: { opacity: 0, transform: 'scale(.98)' },
  exited: { opacity: 0, transform: 'scale(.98)' },
};

export const Btns = connect<React.SFC<IProps>>('accountStore', 'themeStore')(
  ({ accountStore, themeStore }) => {
    const [data, setData] = React.useState(false);
    const { isLogin, userInfo } = accountStore!;
    const closeMenu = () => setData(false);
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
                <Menu style={{ ...transitionStyles[state], transition: '.2s all ease' }}>
                  <MenuItem>
                    <MenuProfile>
                      <Avatar
                        size={48}
                        src="https://zeit.co/api/www/avatar/lifQEaQ6gWoTbqSa6WVzWwZo?&s=96"
                      />
                      <UserName>
                        <span>{userInfo.username}</span>
                      </UserName>
                    </MenuProfile>
                  </MenuItem>
                  <MenuItem>
                    <MenuItemLink onClick={closeMenu} route="/setting/user">
                      设置
                    </MenuItemLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuItemLink onClick={closeMenu} route="/setting/user">
                      退出
                    </MenuItemLink>
                  </MenuItem>
                </Menu>
              )}
            </Transition>
          )}
        >
          <Avatar
            src="https://zeit.co/api/www/avatar/lifQEaQ6gWoTbqSa6WVzWwZo?&s=96"
            onClick={() => setData(true)}
          />
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
);
