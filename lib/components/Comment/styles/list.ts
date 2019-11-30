import { rem } from 'polished';
import styled from 'styled-components';

import { theme } from '@lib/common/utils/themes';

export const Wrapper = styled.div`
  display: grid;
  grid-gap: ${rem('24px')};
`;

export const ItemBox = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: ${rem('8px')};
`;

export const UserName = styled.p`
  font-weight: 700;
  color: ${theme('colors.text')};
  font-size: ${_ => rem(theme('fontSizes[2]')(_))};
`;

export const MainBox = styled.div`
  display: grid;
  grid-row-gap: 6px;
`;

export const ContentBox = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: ${rem('6px')};
  grid-template-areas: 'name'
                       'content'
`;

export const InfoBox = styled.div`
  display: flex;
  align-items: center;
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  color: ${theme('colors.secondary')};
`;
