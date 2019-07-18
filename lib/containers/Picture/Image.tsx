import React from 'react';
import LazyLoad from 'react-lazyload';

import { pictureStyle } from '@lib/common/utils/image';
import { IPictureItemProps } from './Item';
import { ImageBox, ItemImage } from './styles';

interface IPictureImage extends IPictureItemProps {
  blur?: boolean;
}

export const PictureImage: React.FC<IPictureImage> = ({
  detail,
  lazyload,
  size = 'regular',
}) => {
  const height = (1 - (detail.width - detail.height) / detail.width) * 100 || 100;
  const imgRender = (
    <ItemImage
      src={`//cdn.soapphoto.com/${detail.key}${pictureStyle[size]}`}
    />
  );
  return (
    <ImageBox height={height} background={detail.color}>
      {
        lazyload ? (
          <LazyLoad resize={true} height="100%" offset={0}>
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
