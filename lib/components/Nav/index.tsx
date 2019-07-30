import { Router } from '@lib/routes';
import { WithRouterProps } from 'next/dist/client/with-router';
import { withRouter } from 'next/router';
import React, { useCallback } from 'react';

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
  const push = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    Router.pushRoute(route, undefined, {
      shallow: true,
    });
    e.preventDefault();
  }, [route]);
  return (
    <Item>
      <ItemLink onClick={push} active={active} href={route}>
        {children}
      </ItemLink>
    </Item>
  );
});
