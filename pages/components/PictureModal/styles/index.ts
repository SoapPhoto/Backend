import { box } from '@pages/common/utils/themes/common';
import { rem } from 'polished';
import styled from 'styled-components';

const padding = 48;

export const Warpper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  overflow-y: auto;
`;

export const Mask = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0,0,0,0.65);
`;

export const Content = styled.div`
  width: 100%;
  max-width: ${rem('1024px')};
  padding: ${padding}px 0;
  margin: 0 auto;
`;

export const Box = styled.div`
  ${props => box(props.theme, '100%', true)}
  position: relative;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.12) 0px ${rem('6px')} ${rem('32px')} ${rem('0px')};
  padding: 0;
  border: none;
`;

export const ImgBox = styled.div`
`;
