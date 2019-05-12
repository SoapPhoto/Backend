import * as React from 'react';
import { LoadableComponent } from 'react-loadable';
import styled from 'styled-components';

import { href } from '@pages/common/utils/themes/common';
import { Link } from '@pages/routes';
import { darken, lighten } from 'polished';
import { Content } from '../style';

interface IData {
  value: string;
  name: string;
  path: string;
  component: React.ComponentType & LoadableComponent;
}

export interface IUserProps {
  data: IData[];
  value: string;
}

const Wrapper = styled.ul`
  border-right: 1px solid ${props => props.theme.box.borderColor};
`;

const Item = styled.ul`
  padding: 18px 24px;
`;

export const Href = styled.a<{active?: boolean}>`
  ${_ => href(_.active ? _.theme.link.color : darken(.6, _.theme.colors.fontColor))}
  display: block;
`;

export const Menu: React.SFC<IUserProps> = ({
  data,
  value,
}) => {
  const currentData = data.find(v => v.value === value);
  return (
    <>
      <Wrapper>
        {
          data.map(menu => (
            <Link key={menu.value} route={menu.path} shallow>
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
