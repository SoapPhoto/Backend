import styled from 'styled-components';

import { box } from '@pages/common/utils/themes/common';

export const Wrapper = styled.section`
  ${props => box(props.theme, '400px', true)}
  margin-top: 64px;
`;

export const Title = styled.h2`
  margin-bottom: 32px;
  font-weight: 500;
  font-size: ${_ => _.theme.fontSizes[4]}px;
  color: ${props => props.theme.colors.text};
`;
