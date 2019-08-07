import { rem } from 'polished';
import styled from 'styled-components';

import { box } from '@lib/common/utils/themes/common';

export const Warpper = styled.div`
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
`;

export const Content = styled.div`
  top: 0;
  display: inline-block;
  text-align: left;
  vertical-align: middle;
  width: 100%;
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
`;
