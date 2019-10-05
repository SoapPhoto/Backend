import { rem } from 'polished';
import styled from 'styled-components';
import { A } from '@lib/components/A';
import { theme } from '@lib/common/utils/themes';
import { WrapperBox } from '@lib/common/utils/themes/common';

export const Item = styled.span`
  margin-right: 14px;
`;

export const ItemLink = styled(A)<{ active: number }>`
  position: relative;
  color: ${_ => (_.active ? _.theme.colors.text : _.theme.colors.secondary)};
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  text-decoration: none;
  transition: .2s color ease;
  letter-spacing: 2px;
  transition: .2s font-size ease, .2s color ease;
  &:before {
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
  }
`;

export const Wrapper = styled.section`
  ${WrapperBox()}
  padding-bottom: 12px;
  & :last-child {
    font-size: 42px;
  }
`;
