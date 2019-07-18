import { Placement } from 'popper.js';
import styled from 'styled-components';

import { box } from '@lib/common/utils/themes/common';
import { rem } from 'polished';

export const Arrow = styled.span<{placement: Placement}>`
  position: absolute;
  margin-left: ${rem('1px')};
  width: ${rem('10px')};
  height: ${rem('10px')};
  transform: rotate(45deg);
  border: 1px solid transparent;
  &[x-theme^="light"] {
    background-color: ${_ => _.theme.styles.box.background};
  }
  &[x-theme^="dark"] {
    background-color: #363d40;
    border: none;
  }
  &[x-placement^="bottom"] {
    top: ${rem('-4px')};
    border-top-color: ${_ => _.theme.styles.box.borderColor};
    border-left-color: ${_ => _.theme.styles.box.borderColor};
  }
  &[x-placement^="top"] {
    bottom: ${rem('-4px')};
    border-right-color: ${_ => _.theme.styles.box.borderColor};
    border-bottom-color: ${_ => _.theme.styles.box.borderColor};
  }
`;

export const Content = styled.div`
  ${props => box(props.theme, '100%', true)}
  padding: ${rem('4px')} ${rem('12px')};
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  &[x-theme^="light"] {
    box-shadow: ${_ => _.theme.colors.shadowColor} ${rem('0px')} ${rem('6px')} ${rem('32px')} ${rem('0px')};
    background-color: ${_ => _.theme.styles.box.background};
  }
  &[x-theme^="dark"] {
    background-color: #363d40;
    color: #fff;
    border: none;
  }
`;
