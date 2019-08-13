import { rem } from 'polished';
import styled from 'styled-components';
import { Grid } from 'styled-css-grid';

import { theme } from '@lib/common/utils/themes';

export const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  padding: ${rem('24px')};
`;

export const Info = styled.div`
  padding: ${rem('24px')};
  padding-top: 0;
`;

export const EXIFTitle = styled.div`
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  color: ${theme('colors.secondary')};
  margin-bottom: ${rem('4px')};
`;

export const EXIFInfo = styled.div`
  font-size: ${_ => rem(theme('fontSizes[2]')(_))};
`;

export const EXIFBox = styled(Grid)`
  grid-gap: ${rem('24px')};
`;
