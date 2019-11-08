import { rem } from 'polished';
import React from 'react';
import styled, { css } from 'styled-components';

import { href, box } from '@lib/common/utils/themes/common';
import { theme } from '@lib/common/utils/themes';
import { customMedia } from '@lib/common/utils/mediaQuery';
import { Icon } from '@lib/icon';
import { A } from '../A';

interface IData {
  value: string;
  name: string;
  path: string;
  icon: Icon;
}

export interface IUserProps {
  data: IData[];
  value: string;
}

const Box = styled.div`
  ${props => box(props.theme, '800px', true)}
  display: flex;
  flex-direction: row;
  padding: 0;
  margin-top: ${rem('46px')};
  margin-bottom: ${rem('46px')};
  ${customMedia.lessThan('medium')`
    flex-direction: column;
  `}
`;

const MenuBox = styled.ul`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${theme('styles.box.borderColor')};
  padding: ${rem(12)} 0;
  width: 25%;
  ${customMedia.lessThan('medium')`
    width: 100%;
    overflow-y: auto;
    flex-direction: row;
    background-color: ${theme('styles.box.background')};
    border-right: none;
    border-bottom: 1px solid ${theme('styles.box.borderColor')};
  `}
`;

const Item = styled.ul`
  display: flex;
  padding: ${rem(16)} ${rem(32)};
  min-width: max-content;
  & > svg {
    margin-right: ${rem(16)};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: ${rem('32px')};
`;

export const Href = styled(A)<{active: number}>`
  ${_ => href(_.active ? _.theme.colors.text : _.theme.colors.secondary)}
  ${Item} {
    ${_ => (_.active ? css`
      font-weight: 600;
      & > svg {
        stroke: ${theme('styles.link.color')};
      }
    ` as any : undefined)}
  }
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
              <menu.icon size={18} />
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
