import React from 'react';
import styled from 'styled-components';

import { box } from '@pages/common/utils/themes/common';
import { Link } from '@pages/routes';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {

}

interface ILinkProps {
  route?: string;
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
    border-top: 1px solid ${props => props.theme.styles.box.borderColor};
    padding-top: 16px;
    padding-bottom: 16px;
  }
`;

const MenuLink = styled.a`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  color: ${props => props.theme.layout.header.menu.color};
  text-decoration: none;
  transition: color 0.2s ease 0s;
  margin: -8px -20px;
  padding: 8px 20px;
  transition: .2s color ease, .2s background ease;
  &:hover {
    color: ${props => props.theme.layout.header.menu.hover.color};
    background: ${props => props.theme.layout.header.menu.hover.background};
    & svg {
      stroke: ${props => props.theme.layout.header.menu.hover.color};
    }
  }
  & svg {
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 20px;
    height: 37px;
    stroke: ${props => props.theme.layout.header.menu.color};
    transition: .2s stroke ease, .2s background ease;
  }
`;

export const MenuArrow = styled.span`
  position: absolute;
  z-index: 1;
  margin-left: 1px;
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  background-color: ${props => props.theme.styles.box.background};
  border: 1px solid ${props => props.theme.styles.box.borderColor};
  margin-top: -5px;
  border-right-color: transparent;
  border-bottom-color: transparent;
`;

export const Menu: React.FC<IProps> = ({
  children,
  ...restProps
}) => {
  return (
    <Wrapper {...restProps}>
      {children}
    </Wrapper>
  );
};

export const MenuItem: React.FC = ({
  children,
}) => {
  return (
    <ItemWrapper>
      {children}
    </ItemWrapper>
  );
};

export const MenuItemLink: React.FC<ILinkProps> = ({
  route,
  onClick,
  children,
}) => {
  return route ? (
    <Link route={route}>
      <MenuLink onClick={onClick} href={route}>
        {children}
      </MenuLink>
    </Link>
  ) : (
    <MenuLink onClick={onClick} href={route}>
      {children}
    </MenuLink>
  );
};
