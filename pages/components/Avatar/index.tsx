import React from 'react';
import styled from 'styled-components';

export interface IAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src: string;
  size?: number;
}

const Box = styled.span<{size: number; isClick: boolean}>`
  border-radius: 100%;
  display: inline-block;
  font-size: 0;
  overflow: hidden;
  border: 1px solid #eee;
  line-height: 0;
  background: #fff;
  ${props => props.isClick && 'cursor: pointer;'}
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

export const Avatar: React.FC<IAvatarProps> = ({
  src,
  size = 40,
  onClick,
  ...restProps
}) => {
  return (
    <Box size={size} onClick={onClick} isClick={!!onClick} {...restProps}>
      <Img src={src} />
    </Box>
  );
};
