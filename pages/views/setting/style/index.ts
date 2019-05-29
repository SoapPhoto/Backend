import { box } from '@pages/common/utils/themes/common';
import { rem } from 'polished';
import styled from 'styled-components';

export const Warpper = styled.section`
  ${props => box(props.theme, '800px', true)}
  display: grid;
  grid-template-areas: "menu content";
  grid-template-columns: 180px 1fr;
  padding: 0;
  margin-top: ${rem('64px')};
`;

export const Content = styled.div`
  padding: ${rem('32px')};
`;
