import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { getPictureUrl } from '@lib/common/utils/image';
import { Image } from '../Image';

export interface IAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 头像路径
   *
   * @type {string}
   * @memberof IAvatarProps
   */
  src: string;
  /**
   * 尺寸： `24` `32` `48`
   *
   * @type {number}
   * @memberof IAvatarProps
   */
  size?: number;
}

const Box = styled.span<{size: number; isClick: boolean}>`
  border-radius: 100%;
  display: inline-block;
  font-size: 0;
  overflow: hidden;
  border: 2px solid #eee;
  line-height: 0;
  background: #fff;
  user-select: none;
  ${props => props.isClick && 'cursor: pointer;'}
  width: ${props => rem(props.size)};
  height: ${props => rem(props.size)};
`;

const Img = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Avatar: React.FC<IAvatarProps> = ({
  src,
  size = 40,
  onClick,
  ...restProps
}) => (
  <Box size={size} onClick={onClick} isClick={!!onClick} {...restProps}>
    <Img src={getPictureUrl(src, 'thumb')} />
  </Box>
);
