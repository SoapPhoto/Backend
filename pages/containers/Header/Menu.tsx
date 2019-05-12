import React from 'react';
import styled from 'styled-components';

import { box } from '@pages/common/utils/themes/common';
import { Link } from '@pages/routes';
import { darken } from 'polished';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {

}

interface ILinkProps {
  route: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const Wrapper = styled.div`
  ${props => box(props.theme, '100%', true)}
  width: 200px;
  padding: 0;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 32px 0px;
`;

const ItemWrapper = styled.div`
  padding: 8px 20px;
  &:first-child {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  &:not(:first-child) {
    border-top: 1px solid ${props => props.theme.box.borderColor};
    padding-top: 16px;
    padding-bottom: 16px;
  }
`;

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  color: ${props => props.theme.header.menu.color};
  text-decoration: none;
  transition: color 0.2s ease 0s;
  margin: -8px -20px;
  padding: 8px 20px;
  transition: .2s color ease, .2s background ease;
  &:hover {
    color: ${props => props.theme.header.menu.hover.color};
    background: ${props => props.theme.header.menu.hover.background};
  }
`;

export const Menu: React.SFC<IProps> = ({
  children,
  ...restProps
}) => {
  return (
    <Wrapper {...restProps}>
      {children}
    </Wrapper>
  );
};

export const MenuItem: React.SFC = ({
  children,
}) => {
  return (
    <ItemWrapper>
      {children}
    </ItemWrapper>
  );
};

export const MenuItemLink: React.SFC<ILinkProps> = ({
  route,
  onClick,
  children,
}) => {
  return (
    <Link route={route}>
      <MenuLink onClick={onClick} href={route}>
        {children}
      </MenuLink>
    </Link>
  );
};
