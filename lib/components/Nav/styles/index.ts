import { rem } from 'polished';
import styled, { css } from 'styled-components';
import { A } from '@lib/components/A';
import { theme } from '@lib/common/utils/themes';
import { WrapperBox } from '@lib/common/utils/themes/common';
import { customMedia } from '@lib/common/utils/mediaQuery';

export const Item = styled.span`
  display: inline-block;
  margin-right: ${rem(8)};
`;

export const ItemLink = styled(A)<{ active: number }>`
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
    font-weight: 700;
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

export const Wrapper = styled.section`
  ${WrapperBox()}
  /* padding-bottom: ${rem(12)}; */
  display: flex;
  flex-wrap: wrap;
  /* ${customMedia.lessThan('mobile')`
    justify-content: space-between;
  `} */
  & :last-child {
    font-size: 42px;
  }
`;
