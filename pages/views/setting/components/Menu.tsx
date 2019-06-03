import { darken, rem } from 'polished';
import React from 'react';
import { LoadableComponent } from 'react-loadable';
import styled from 'styled-components';

import { href } from '@pages/common/utils/themes/common';
import { Link } from '@pages/routes';
import { Content } from '../style';

interface IData {
  value: string;
  name: string;
  path: string;
  component: React.ComponentType;
}

export interface IUserProps {
  data: IData[];
  value: string;
}

const Wrapper = styled.ul`
  border-right: 1px solid ${props => props.theme.styles.box.borderColor};
`;

const Item = styled.ul`
  padding: ${rem('18px')} ${rem('24px')};
`;

export const Href = styled.a<{active?: boolean}>`
  ${_ => href(_.active ? _.theme.styles.link.color : darken(.6, _.theme.colors.text))}
  display: block;
`;

export const Menu: React.FC<IUserProps> = ({
  data,
  value,
}) => {
  const currentData = data.find(v => v.value === value);
  return (
    <>
      <Wrapper>
        {
          data.map(menu => (
            <Link key={menu.value} route={menu.path}>
              <Href href={menu.path} active={menu.value === value}>
                <Item>
                  {menu.name}
                </Item>
              </Href>
            </Link>
          ))
        }
      </Wrapper>
      <Content>
        {
          currentData &&
          <currentData.component />
        }
      </Content>
    </>
  );
};
