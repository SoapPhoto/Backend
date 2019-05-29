import styled from 'styled-components';

import { box } from '@pages/common/utils/themes/common';
import { rem } from 'polished';

export const Wrapper = styled.section`
  ${props => box(props.theme, '400px', true)}
  margin-top: ${rem('64px')};
`;

export const Title = styled.h2`
  margin-bottom: ${rem('32px')};
  font-weight: 500;
  font-size: ${_ => rem(_.theme.fontSizes[4])};
  color: ${props => props.theme.colors.text};
`;
