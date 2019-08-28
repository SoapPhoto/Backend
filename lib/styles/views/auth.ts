import styled from 'styled-components';

import { box } from '@lib/common/utils/themes/common';
import { rem } from 'polished';
import { theme } from '@lib/common/utils/themes';

export const Wrapper = styled.section`
  ${props => box(props.theme, '480px', true)}
  margin-top: ${rem('64px')};
  margin-bottom: ${rem('64px')};
  padding: ${rem('52px')} ${rem('80px')};
`;

export const Title = styled.h2`
  margin-bottom: ${rem('32px')};
  font-weight: 500;
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  color: ${theme('colors.text')};
`;
