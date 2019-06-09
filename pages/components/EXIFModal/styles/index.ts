import { box } from '@pages/common/utils/themes/common';
import { rem } from 'polished';
import styled from 'styled-components';
import { Grid } from 'styled-css-grid';

export const Title = styled.h2`
  font-size: ${_ => _.theme.fontSizes[3]};
  padding: ${rem('24px')};
`;

export const Info = styled.div`
  padding: ${rem('24px')};
  padding-top: 0;
`;

export const EXIFTitle = styled.div`
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  color: ${_ => _.theme.colors.secondary};
  margin-bottom: ${rem('4px')};
`;

export const EXIFInfo = styled.div`
  font-size: ${_ => rem(_.theme.fontSizes[2])};
`;

export const EXIFBox = styled(Grid)`
  grid-gap: ${rem('24px')};
`;
