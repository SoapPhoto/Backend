import { Heart } from '@pages/icon';
import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { Popover } from '../Popover';

interface IProps {
  size?: number;
  color?: string;
  isLike: boolean;
  popover?: boolean;
  onLike(): void;
}

const Button = styled.div<{like: boolean; color?: string}>`
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
  pointer-events: auto;
  user-select: none;
  margin-left: ${rem('12px')};
  & svg {
    fill: ${_ => _.like ? '#f44336' : 'none'};
    stroke: ${_ => _.like ? '#f44336' : _.color || '#fff'};
    transition: .2s fill ease, .2s stroke ease, .2s transform ease;
  }
  transition: transform 0.1s;
  &:active {
    & svg {
      transform: scale(0.7);
    }
  }
`;

export const LikeButton: React.FC<IProps> = ({
  isLike,
  color,
  popover = true,
  size = 18,
  onLike = () => null,
}) => {
  const content = (
    <Button onClick={onLike} color={color} like={isLike} >
      <Heart size={size} />
    </Button>
  );
  if (popover) {
    return (
      <Popover
        trigger="hover"
        placement="top"
        theme="dark"
        openDelay={100}
        content={<span>{isLike ? '取消喜欢' : '喜欢'}</span>}
      >
        {content}
      </Popover>
    );
  }
  return content;
};
