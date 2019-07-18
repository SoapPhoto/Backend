import { rem } from 'polished';
import styled from 'styled-components';

import { box } from '@lib/common/utils/themes/common';

export const Warpper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  overflow-y: auto;
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: auto;
  height: 100%;
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
