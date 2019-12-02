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

export const UserLabel = styled.span`
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  color: ${theme('colors.secondary')};
  margin-left: ${rem(6)};
`;

export const MainBox = styled.div`
  display: grid;
  grid-row-gap: 6px;
`;

export const ContentBox = styled.div`
`;

export const InfoBox = styled.div`
  display: flex;
  align-items: center;
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  color: ${theme('colors.secondary')};
`;

export const ReplyLabel = styled.span`
  color: ${theme('colors.secondary')};
`;

export const ContentItem = styled.div`
  margin-bottom: ${rem(4)};
`;

export const ConfirmText = styled.button`
  display: inline-block;
  border: none;
  background: none;
  outline: none;
  color: inherit;
  cursor: pointer;
`;

export const ChildComment = styled.div`
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    left: -24px;
    top: 0px;
    background-color: ${theme('colors.gray')};
  }
`;

export const Dot = styled.span`
  font-family: monospace;
  margin: ${rem(4)} 0;
`;

export const MoreChildComment = styled.div`
  color: ${theme('colors.primary')};
  text-align: center;
`;
