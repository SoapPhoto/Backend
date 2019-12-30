import { rem } from 'polished';
import styled, { css } from 'styled-components';
import { A } from '@lib/components/A';
import { theme } from '@lib/common/utils/themes';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { WrapperBox } from '@lib/common/utils/themes/common';

export const Item = styled.span`
  display: inline-block;
  font-size: 0px;
  margin-right: ${rem(8)};
`;

export const ItemLink = styled(A)<{ active: number }>`
  display: block;
  position: relative;
  color: ${_ => (_.active ? _.theme.colors.text : _.theme.colors.secondary)};
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  line-height: ${rem(22)};
  text-decoration: none;
  transition: .2s color ease;
  letter-spacing: 2px;
  transition: .2s font-size ease, .2s color ease;
  padding: ${rem(8)} ${rem(24)};
  border-radius: ${rem(22)};
  white-space: nowrap;
  ${_ => (_.active ? css`
    background-color: ${theme('colors.gray')};
    font-weight: 600;
  ` : css``)}
  /* &:before {
    background: ${theme('colors.primary')};
    bottom: -10px;
    content: "";
    width: 6px;
    height: 6px;
    left: 0;
    margin: auto;
    opacity: ${_ => (_.active ? 1 : 0)};
    position: absolute;
    right: 0;
    transition: all 0.3s ease 0s;
    border-radius: 10px;
  } */
`;

export const Box = styled.div`
  font-size: 0;
`;

export const Wrapper = styled(OverlayScrollbarsComponent)`
  ${WrapperBox()}
  white-space: nowrap;
  overflow: hidden;
  overflow-x: scroll; /* 1 */
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  -webkit-overflow-scrolling: touch; /* 2 */
  text-align: justify; /* 3 */
  &::-webkit-scrollbar {
    display: none;
  }
  & :last-child {
    font-size: 42px;
  }
`;
