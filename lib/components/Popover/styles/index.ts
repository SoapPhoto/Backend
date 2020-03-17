import { Placement } from 'popper.js';
import styled from 'styled-components';

import { box } from '@lib/common/utils/themes/common';
import { rem } from 'polished';
import { theme } from '@lib/common/utils/themes';

export const Arrow = styled.span<{placement?: Placement}>`
  &,
  &::before {
    width: 10px;
    height: 10px;
    position: absolute;
    z-index: -1;
  }
  &::before {
    content: '';
    transform: rotate(45deg);
    background: ${theme('styles.box.background')};
    top: 0;
    left: 0;
    border: 1px solid transparent;
  }
  &[x-theme^="light"] {
    &::before {
      background-color: ${theme('styles.box.background')};
      border-color: ${theme('styles.box.borderColor')};
    }
  }
  &[x-theme^="dark"] { 
    &::before {
      background-color: #363d40;
      border: none;
    }
  }
`;

export const Content = styled.div`
  ${props => box(props.theme, '100%', true)}
  width: auto;
  padding: ${rem('4px')} ${rem('12px')};
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  &[x-theme^="light"] {
    box-shadow: ${theme('colors.shadowColor')} 0 ${rem('6px')} ${rem('32px')} 0;
    background-color: ${theme('styles.box.background')};
  }
  &[x-theme^="dark"] {
    background-color: #363d40;
    color: #fff;
    border: none;
  }
`;

export const Wrapper = styled.div`
  z-index: 1100;
  &[data-popper-placement^="bottom"] {
    ${Arrow} {
      top: ${rem('-4px')};
    }
  }
  &[data-popper-placement^="top"] {
    ${Arrow} {
      bottom: ${rem('-4px')};
    }
  }
  &[data-popper-placement^="right"] {
    ${Arrow} {
      left: ${rem('-4px')};
    }
  }
  &[data-popper-placement^="left"] {
    ${Arrow} {
      right: ${rem('-4px')};
    }
  }
`;
