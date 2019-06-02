import { Link } from '@pages/routes';
import { rem } from 'polished';
import styled from 'styled-components';

export const Item = styled.span`
  margin-right: 14px;
`;

export const ItemLink = styled.a<{ active: boolean }>`
  color: ${_ => _.active ? _.theme.colors.text : _.theme.colors.secondary};
  font-size: ${_ => rem(_.theme.fontSizes[3])};
  text-decoration: none;
  transition: .2s color ease;
`;

export const Wrapper = styled.section`
  width: 100%;
  max-width: ${rem('1300px')};
  margin: 0 auto;
  padding: 0 ${rem('24px')};
  & :last-child {
    font-size: 42px;
  }
`;
