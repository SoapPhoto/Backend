import React from 'react';
import styled from 'styled-components';

import { Link } from '@lib/routes';
import { rem } from 'polished';
import { theme } from '@lib/common/utils/themes';


type IProps = React.HTMLAttributes<HTMLDivElement>
// interface IProps extends React.HTMLAttributes<HTMLDivElement> {

// }

interface ILinkProps {
  route?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const Wrapper = styled.div`
  width: ${rem('200px')};
  font-size: ${theme('fontSizes[1]')};
`;

const ItemWrapper = styled.div`
  padding: ${rem('8px')} ${rem('20px')};
  &:first-child {
    padding-top: ${rem('16px')};
    padding-bottom: ${rem('16px')};
  }
  &:not(:first-child) {
    border-top: 1px solid ${theme('styles.box.borderColor')};
    padding-top: ${rem('16px')};
    padding-bottom: ${rem('16px')};
  }
`;

const MenuLink = styled.a`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  color: ${theme('layout.header.menu.color')};
  text-decoration: none;
  transition: color 0.2s ease 0s;
  margin:  ${rem('-8px')} ${rem('-20px')};
  padding: ${rem('8px')} ${rem('20px')};
  transition: .2s color ease, .2s background ease;
  &:hover {
    color: ${theme('layout.header.menu.hover.color')};
    background: ${theme('layout.header.menu.hover.background')};
    & svg {
      stroke: ${theme('layout.header.menu.hover.color')};
    }
  }
  & svg {
    position: absolute;
    top: ${rem('0px')};
    bottom: ${rem('0px')};
    right: ${rem('20px')};
    height: ${rem('37px')};
    stroke: ${theme('layout.header.menu.color')};
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
  background-color: ${theme('styles.box.background')};
  border: 1px solid ${theme('styles.box.borderColor')};
  margin-top: ${rem('-5px')};
  border-right-color: transparent;
  border-bottom-color: transparent;
`;

export const Menu: React.FC<IProps> = ({
  children,
  ...restProps
}) => (
  <Wrapper {...restProps}>
    {children}
  </Wrapper>
);

export const MenuItem: React.FC = ({
  children,
}) => (
  <ItemWrapper>
    {children}
  </ItemWrapper>
);

export const MenuItemLink: React.FC<ILinkProps> = ({
  route,
  onClick,
  children,
}) => (route ? (
  <Link route={route}>
    <MenuLink onClick={onClick} href={route}>
      {children}
    </MenuLink>
  </Link>
) : (
  <MenuLink onClick={onClick} href={route}>
    {children}
  </MenuLink>
));
