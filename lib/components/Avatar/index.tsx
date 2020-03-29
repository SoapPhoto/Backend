import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { getPictureUrl } from '@lib/common/utils/image';
import LazyLoad from 'react-lazyload';
import { BadgeEntity } from '@lib/common/interfaces/badge';
import { StrutAlign, BadgeCert } from '@lib/icon';
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

  /**
   * 是否懒加载
   *
   * @type {boolean}
   * @memberof IAvatarProps
   */
  lazyload?: boolean;

  badge?: BadgeEntity[];
}

const Wrapper = styled.div<{ size: number }>`
  position: relative;
  width: ${props => rem(props.size)};
  height: ${props => rem(props.size)};
  min-width: ${props => rem(props.size)};
  min-height: ${props => rem(props.size)};
`;

const Box = styled.span<{ isClick: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  display: inline-block;
  font-size: 0;
  overflow: hidden;
  border: 2px solid #eee;
  line-height: 0;
  background: #fff;
  user-select: none;
  ${props => props.isClick && 'cursor: pointer;'}
`;

const Img = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BadgeBox = styled.div`
  position: absolute;
`;

export const Avatar: React.FC<IAvatarProps> = ({
  src,
  size = 40,
  onClick,
  badge,
  lazyload = false,
  ...restProps
}) => (
  <Wrapper {...restProps} size={size}>
    <Box onClick={onClick} isClick={!!onClick}>
      {
        lazyload ? (
          <LazyLoad resize offset={400}>
            <Img src={getPictureUrl(src, 'thumb')} />
          </LazyLoad>

        ) : (
          <Img src={getPictureUrl(src, 'thumb')} />
        )
      }
    </Box>
    {
      badge && badge.find(v => v.name === 'user-cert') && (
        <BadgeBox style={{ bottom: rem(-(size / 60)), right: rem(-(size / 60)) }}>
          <StrutAlign>
            <BadgeCert size={Math.max(size / 4, 16)} />
          </StrutAlign>
        </BadgeBox>
      )
    }
  </Wrapper>
);
