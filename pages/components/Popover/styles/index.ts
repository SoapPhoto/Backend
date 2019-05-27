import { Placement } from 'popper.js';
import styled from 'styled-components';

import { box } from '@pages/common/utils/themes/common';
import { PopoverTheme } from '..';

export const Arrow = styled.span<{placement: Placement}>`
  position: absolute;
  margin-left: 1px;
  width: 10px;
  height: 10px;
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
    top: -4px;
    border-top-color: ${_ => _.theme.styles.box.borderColor};
    border-left-color: ${_ => _.theme.styles.box.borderColor};
  }
  &[x-placement^="top"] {
    bottom: -4px;
    border-right-color: ${_ => _.theme.styles.box.borderColor};
    border-bottom-color: ${_ => _.theme.styles.box.borderColor};
  }
`;

export const Content = styled.div`
  ${props => box(props.theme, '100%', true)}
  padding: 4px 12px;
  font-size: 12px;
  &[x-theme^="light"] {
    box-shadow: ${_ => _.theme.colors.shadowColor} 0px 6px 32px 0px;
    background-color: ${_ => _.theme.styles.box.background};
  }
  &[x-theme^="dark"] {
    background-color: #363d40;
    color: #fff;
    border: none;
  }
`;
