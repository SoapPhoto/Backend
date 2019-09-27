import { rem } from 'polished';
import React from 'react';
import styled, { keyframes } from 'styled-components';

interface ILoadingProps {
  size?: number;
  color?: string;
}

const animate = keyframes`
  0%{
    opacity:0.2;
  }
  20%{
    opacity:1;
  }
  100%{
    opacity:0.2;
  }
`;

export const Box = styled.div<{size: number; color?: string}>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, min-content);
  justify-content: center;
  align-items: center;
  & span {
    animation-name: ${animate};
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    width: ${_ => _.size}px;
    height: ${_ => _.size}px;
    background-color: ${_ => _.color || _.theme.colors.text};
    display: inline-block;
    border-radius: 100%;
    margin: 0px ${_ => _.size / 2}px;
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

export const Loading: React.FC<ILoadingProps> = ({
  size = 6,
  color,
}) => (
  <Box size={size} color={color}>
    <span />
    <span />
    <span />
  </Box>
);
