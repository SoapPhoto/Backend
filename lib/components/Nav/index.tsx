import React from 'react';

import { useRouter } from '@lib/router';
import { Item, ItemLink, Wrapper } from './styles';

export interface INavItemProps {
  route: string;
}

export const Nav: React.FC = ({
  children,
}) => (
  <Wrapper>
    {children}
  </Wrapper>
);

export const NavItem: React.FC<INavItemProps> = (({
  children,
  route,
}) => {
  const { pathname } = useRouter();
  const active = pathname === route;
  return (
    <Item>
      <ItemLink active={active ? 1 : 0} route={route}>
        {children}
      </ItemLink>
    </Item>
  );
});
