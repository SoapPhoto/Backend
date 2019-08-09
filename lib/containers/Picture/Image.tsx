import React, { useState, useEffect, useRef } from 'react';
import LazyLoad from 'react-lazyload';
import { CSSTransition } from 'react-transition-group';

import { getPictureUrl } from '@lib/common/utils/image';
import { IPictureItemProps } from './Item';
import { ImageBox, ItemImage } from './styles';

interface IPictureImage extends IPictureItemProps {
  blur?: boolean;
  zooming?: boolean;
}

export const PictureImage: React.FC<IPictureImage> = ({
  detail,
  lazyload,
  size = 'regular',
}) => {
  const height = (1 - (detail.width - detail.height) / detail.width) * 100 || 100;
  const imgRender = (
    <ItemImage
      src={getPictureUrl(detail.key, size)}
    />
  );
  return (
    <ImageBox height={height} background={detail.color}>
      {
        lazyload ? (
          <LazyLoad resize height="100%" offset={0}>
            {imgRender}
          </LazyLoad>
        ) : (
          <div>
            {imgRender}
          </div>
        )
      }
    </ImageBox>
  );
};
