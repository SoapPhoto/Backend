import React from 'react';

import { connect } from '@lib/common/utils/store';
import { Avatar } from '@lib/components';
import { Popover } from '@lib/components/Popover';
import { Upload, User } from '@lib/icon';
import { Link } from '@lib/routes';
import { AccountStore } from '@lib/stores/AccountStore';
import { ThemeStore } from '@lib/stores/ThemeStore';
import { Menu, MenuItem, MenuItemLink } from './Menu';
import {
  Href, MenuProfile, RightWarpper, UserName,
} from './styles';

export interface IProps {
  accountStore?: AccountStore;
  themeStore?: ThemeStore;
}

export const Btns = connect<React.FC<IProps>>('accountStore', 'themeStore')(
  ({ accountStore, themeStore }) => {
    const PopoverRef = React.useRef<Popover>(null);
    const { isLogin, userInfo } = accountStore!;
    const { theme, setTheme } = themeStore!;
    const closeMenu = () => {
      PopoverRef.current!.close();
    };
    const logout = () => {
      closeMenu();
      accountStore!.logout();
    };
    const switchTheme = () => {
      setTheme(theme === 'dark' ? 'base' : 'dark');
    };
    let content = (
      <Href route="/login">
        <User />
      </Href>
    );
    if (isLogin && userInfo) {
      content = (
        <Popover
          ref={PopoverRef}
          trigger="click"
          contentStyle={{ padding: 0 }}
          content={(
            <Menu>
              <MenuItem>
                <MenuItemLink onClick={closeMenu} route={`/@${userInfo.username}`}>
                  <MenuProfile>
                    <Avatar
                      size={48}
                      src={userInfo!.avatar}
                    />
                    <UserName>
                      <span>{userInfo.name || userInfo.username}</span>
                    </UserName>
                  </MenuProfile>
                </MenuItemLink>
              </MenuItem>
              <MenuItem>
                <MenuItemLink onClick={closeMenu} route="/upload">
                  上传图片
                  <Upload size={18} />
                </MenuItemLink>
              </MenuItem>
              <MenuItem>
                <MenuItemLink onClick={closeMenu} route="/setting/profile">
                  设置
                </MenuItemLink>
              </MenuItem>
              <MenuItem>
                <MenuItemLink onClick={switchTheme}>
                  {theme === 'dark' ? '日间模式' : '夜间模式'}
                </MenuItemLink>
              </MenuItem>
              <MenuItem>
                <MenuItemLink onClick={logout}>
                  退出
                </MenuItemLink>
              </MenuItem>
            </Menu>
          )}
        >
          <Avatar
            src={userInfo!.avatar}
          />
        </Popover>
      );
    }
    return (
      <RightWarpper>
        {content}
      </RightWarpper>
    );
  },
);
