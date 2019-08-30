import { rem, timingFunctions } from 'polished';
import styled from 'styled-components';

import { box } from '@lib/common/utils/themes/common';
import media from 'styled-media-query';
import { X } from '@lib/icon';

export const Wrapper = styled.div`
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
  }
`;

export const Box = styled.div`
  ${props => box(props.theme, '100%', true)}
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
  max-width: ${rem('560px')};
  border: none;
  margin: ${rem('24px')} auto;
  transition-timing-function: ${timingFunctions('easeInOutSine')};
  transition: .2s all;
  ${media.lessThan('small')`
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 0;
    overflow-y: auto;
  `}
`;

export const Content = styled.div`
  top: 0;
  display: inline-block;
  text-align: left;
  vertical-align: middle;
  width: 100%;
  ${media.lessThan('small')`
    height: 100%;
  `}
`;

export const Mask = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  user-select: none;
  background-color: rgba(0,0,0,0.4);
  transition-timing-function: ${timingFunctions('easeInOutSine')};
  transition: .2s all;
`;

export const XIcon = styled(X)`
  display: none;
  position: fixed;
  right: ${rem(24)};
  top: ${rem(24)};
  cursor: pointer;
  ${media.lessThan('small')`
    display: block;
  `}
`;
