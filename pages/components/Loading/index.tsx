import { rem } from 'polished';
import React from 'react';
import styled, { keyframes } from 'styled-components';

interface ILoadingProps {
  size?: number;
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

export const Box = styled.div<{size: number}>`
  display: flex;
  align-items: center;
  justify-content: center;
  & span {
    animation-name: ${animate};
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    width: ${_ => rem(_.size)};
    height: ${_ => rem(_.size)};
    background-color: rgb(68, 68, 68);
    display: inline-block;
    border-radius: 50%;
    margin: 0px ${_ => rem(_.size / 2)};
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

export const Loading: React.FC<ILoadingProps> = ({
  size = 4,
}) => {
  return (
    <Box size={size}>
      <span />
      <span />
      <span />
    </Box>
  );
};
