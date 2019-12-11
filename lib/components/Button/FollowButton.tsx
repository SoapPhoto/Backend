import React from 'react';
import styled from 'styled-components';

import { theme } from '@lib/common/utils/themes';
import { ArrowHorizontal, StrutAlign } from '@lib/icon';
import { Button, IButtonProps } from '.';

interface IProps extends IButtonProps {
  isFollowing: number;
}

const LButton = styled(Button)<{isFollowing: number}>`
  background: ${theme('colors.gray')};
  color: ${theme('colors.secondary')};
  border-color: ${theme('colors.gray')};
  &:hover {
    color: ${theme('colors.pure')};
    background-color: ${theme('colors.danger')};
    border-color: ${theme('colors.danger')};
    & span {
      display: none;
    }
    &::before {
      content: '取消关注'
    }
  }
`;

export const FollowButton: React.FC<IProps> = ({ isFollowing, ...rest }) => {
  let content = '关注';
  if (isFollowing === 1) content = '已关注';
  if (isFollowing === 2) content = '互相关注';
  return isFollowing === 0 ? (
    <Button {...rest}>{content}</Button>
  ) : (
    <LButton {...rest} isFollowing={isFollowing}>
      <span>
        {isFollowing === 2 && (<StrutAlign><ArrowHorizontal size={11} /></StrutAlign>)}
        {content}
      </span>
    </LButton>
  );
};
