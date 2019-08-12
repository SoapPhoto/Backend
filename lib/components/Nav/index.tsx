import { WithRouterProps } from 'next/dist/client/with-router';
import { withRouter } from 'next/router';
import React from 'react';

import { Item, ItemLink, Wrapper } from './styles';

export interface INavItemProps extends WithRouterProps {
  route: string;
}

export const Nav: React.FC = ({
  children,
}) => (
  <Wrapper>
    {children}
  </Wrapper>
);

export const NavItem = withRouter<INavItemProps>(({
  children,
  route,
  router,
}) => {
  const active = router!.asPath === route;
  return (
    <Item>
      <ItemLink active={active ? 1 : 0} route={route}>
        {children}
      </ItemLink>
    </Item>
  );
});
