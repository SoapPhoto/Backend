import { rem, timingFunctions } from 'polished';
import styled from 'styled-components';
import { theme } from '@lib/common/utils/themes';

import { box } from '@lib/common/utils/themes/common';
import { X } from '@lib/icon';
import { customMedia, customBreakpoints } from '@lib/common/utils/mediaQuery';
import { Lazy } from '../Lazy';

export const Box = styled.div`
  position: relative;
  ${props => box(props.theme, '100%', true)}
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  max-width: ${rem(customBreakpoints.medium)};
  border: none;
  margin: ${rem('24px')} auto;
  transition-timing-function: ${timingFunctions('easeInOutSine')};
  transition: .2s all;
`;

export const Content = styled.div`
  top: 0;
  display: inline-block;
  text-align: left;
  vertical-align: middle;
  width: 100%;
`;

export const LazyWrapper = styled(Lazy)<{ fullscreen: number }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
  &::before {
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
    content: '';
    ${_ => (!_.fullscreen ? customMedia.lessThan('mobile')`
      vertical-align: bottom;
    ` : customMedia.lessThan('mobile')`
    `)}
  }
  ${Content} {
    ${_ => (!_.fullscreen ? customMedia.lessThan('mobile')`
    ` : customMedia.lessThan('mobile')`
      height: 100%;
    `)}
  }
  ${Box} {
    ${_ => (!_.fullscreen ? customMedia.lessThan('mobile')`
      max-width: calc(100% - ${rem(32)}) !important;
      width: 100%;
    ` : customMedia.lessThan('mobile')`
      max-width: 100% !important;
      width: 100%;
      height: 100%;
      margin: 0;
      border-radius: 0;
      overflow-y: auto;
    `)}
  }
`;

export const LazyMask = styled(Lazy)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  user-select: none;
  background-color: rgba(0,0,0,0.4);
`;

export const XIcon = styled(X)`
  display: none;
  position: fixed;
  right: ${rem(24)};
  top: ${rem(24)};
  cursor: pointer;
  z-index: 2;
  ${customMedia.lessThan('mobile')`
    display: block;
  `}
`;

// Components

export const ModalContent = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
`;

export const ModalBackground = styled.div<{background: string}>`
position: absolute;
  top: 0;
  z-index: 0;
  width: 100%;
  height: 150px;
  filter: blur(4px);
  background: ${_ => _.background};
  background-repeat: no-repeat;
  background-size: cover;
`;

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${rem(14)};
  border-bottom: 1px solid ${theme('colors.shadowColor')};
`;

export const ModalTitle = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
`;
