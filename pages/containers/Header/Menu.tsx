import React from 'react';
import styled from 'styled-components';

import { box } from '@pages/common/utils/themes/common';
import { Link } from '@pages/routes';
import { rem } from 'polished';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {

}

interface ILinkProps {
  route?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const Wrapper = styled.div`
  width: ${rem('200px')};
  font-size: ${rem('14px')};
`;

const ItemWrapper = styled.div`
  padding: ${rem('8px')} ${rem('20px')};
  &:first-child {
    padding-top: ${rem('16px')};
    padding-bottom: ${rem('16px')};
  }
  &:not(:first-child) {
    border-top: 1px solid ${props => props.theme.styles.box.borderColor};
    padding-top: ${rem('16px')};
    padding-bottom: ${rem('16px')};
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
  margin:  ${rem('-8px')} ${rem('-20px')};
  padding: ${rem('8px')} ${rem('20px')};
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
    top: ${rem('0px')};
    bottom: ${rem('0px')};
    right: ${rem('20px')};
    height: ${rem('37px')};
    stroke: ${props => props.theme.layout.header.menu.color};
    transition: .2s stroke ease, .2s background ease;
  }
`;

export const MenuArrow = styled.span`
  position: absolute;
  z-index: 1;
  margin-left: ${rem('1px')};
  width: ${rem('10px')};
  height: ${rem('10px')};
  transform: rotate(45deg);
  background-color: ${props => props.theme.styles.box.background};
  border: 1px solid ${props => props.theme.styles.box.borderColor};
  margin-top: ${rem('-5px')};
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
