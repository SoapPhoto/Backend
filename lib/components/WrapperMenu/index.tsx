import { darken, rem } from 'polished';
import React from 'react';
import styled from 'styled-components';

import { href, box } from '@lib/common/utils/themes/common';
import { theme } from '@lib/common/utils/themes';
import { customMedia } from '@lib/common/utils/mediaQuery';
import { A } from '../A';

interface IData {
  value: string;
  name: string;
  path: string;
}

export interface IUserProps {
  data: IData[];
  value: string;
}

const Box = styled.div`
  ${props => box(props.theme, '800px', true)}
  display: grid;
  grid-template-columns: 180px 1fr;
  padding: 0;
  margin-top: ${rem('46px')};
  margin-bottom: ${rem('46px')};
  ${customMedia.lessThan('medium')`
    grid-template-columns: auto;
  `}
`;

const MenuBox = styled.ul`
  border-right: 1px solid ${theme('styles.box.borderColor')};
  ${customMedia.lessThan('medium')`
    width: 100%;
    background-color: ${theme('styles.box.background')};
    border-right: none;
    border-bottom: 1px solid ${theme('styles.box.borderColor')};
  `}
`;

const Item = styled.ul`
  padding: ${rem('18px')} ${rem('24px')};
`;

const Content = styled.div`
  padding: ${rem('32px')};
`;

export const Href = styled(A)<{active: number}>`
  ${_ => href(_.active ? _.theme.styles.link.color : darken(0.6, _.theme.colors.text))}
  display: block;
`;

export const Menu: React.FC<IUserProps> = ({
  data,
  value,
  children,
}) => (
  <Box>
    <MenuBox>
      {
        data.map(menu => (
          <Href key={menu.name} route={menu.path} active={(menu.value === value) ? 1 : 0}>
            <Item>
              {menu.name}
            </Item>
          </Href>
        ))
      }
    </MenuBox>
    <Content>
      {children}
    </Content>
  </Box>
);
