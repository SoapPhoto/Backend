import { box } from '@pages/common/utils/themes/common';
import styled from 'styled-components';

export const Warpper = styled.section`
  ${props => box(props.theme, '700px', true)}
  display: grid;
  grid-template-areas: "menu content";
  grid-template-columns: 180px 1fr;
  padding: 0;
  margin-top: 64px;
`;

export const Content = styled.div`
  padding: 32px;
`;
