import { rem } from 'polished';
import styled from 'styled-components';

import { theme, activate } from '@lib/common/utils/themes';

export const Wrapper = styled.div`
  display: grid;
  grid-gap: ${rem('24px')};
`;

export const ItemBox = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: ${rem('16px')};
`;

export const UserName = styled.p`
  font-weight: 600;
  color: ${theme('colors.text')};
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
`;

export const UserLabel = styled.span`
  display: inline-block;
  font-size: ${_ => rem(theme('fontSizes[0]')(_) as number - 2)};
  color: #fff;
  background-color: ${theme('colors.baseGreen')};
  margin-left: ${rem(6)};
  border-radius: 4px;
  padding: 1px 4px;
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
  display: inline-block;
  margin-left: ${rem(6)};
`;

export const ContentItem = styled.div`
  display: flex;
  align-items: center;
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
  margin: 0 ${rem(4)};
`;

export const MoreChildComment = styled.div`
  text-align: center;
`;

export const MoreChildCommentBtn = styled.button`
  cursor: pointer;
  display: inline-block;
  border: none;
  background: none;
  outline: none;
  color: ${theme('colors.primary')};
  ${activate()}
`;
