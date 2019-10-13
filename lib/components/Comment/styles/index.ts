import { rem } from 'polished';
import styled from 'styled-components';

import { customBreakpoints } from '@lib/common/utils/mediaQuery';

export const Wrapper = styled.div`
  max-width: ${rem(customBreakpoints.large)};
  margin: ${rem('48px')} auto;
  margin-bottom: ${rem('24px')};
`;
