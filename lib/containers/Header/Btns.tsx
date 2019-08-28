import React from 'react';

import { connect } from '@lib/common/utils/store';
import { Avatar } from '@lib/components';
import { Popover } from '@lib/components/Popover';
import { Upload, User } from '@lib/icon';
import { AccountStore } from '@lib/stores/AccountStore';
import { ThemeStore } from '@lib/stores/ThemeStore';
import { useTranslation } from '@lib/i18n/useTranslation';
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
    const { t } = useTranslation();
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
                  {t('menu.upload')}
                  <Upload size={18} />
                </MenuItemLink>
              </MenuItem>
              <MenuItem>
                <MenuItemLink onClick={closeMenu} route="/setting/profile">
                  {t('menu.setting')}
                </MenuItemLink>
              </MenuItem>
              <MenuItem>
                <MenuItemLink onClick={switchTheme}>
                  {theme === 'dark' ? t('menu.light') : t('menu.dark')}
                </MenuItemLink>
              </MenuItem>
              <MenuItem>
                <MenuItemLink onClick={logout}>
                  {t('menu.signup')}
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
