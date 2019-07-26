import React, { useEffect, useRef, useState } from 'react';
import LazyLoad from 'react-lazyload';
import { CSSTransition } from 'react-transition-group';

import { pictureStyle } from '@lib/common/utils/image';
import { Zooming } from '@lib/components/zooming';
import { IPictureItemProps } from './Item';
import { ImageBox, ItemImage } from './styles';

interface IPictureImage extends IPictureItemProps {
  blur?: boolean;
  zooming?: boolean;
}

export const PictureImage: React.FC<IPictureImage> = ({
  detail,
  lazyload,
  zooming = false,
  size = 'regular',
}) => {
  const [isFade, setFade] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const height = (1 - (detail.width - detail.height) / detail.width) * 100 || 100;
  const imgRef = (ref: HTMLImageElement) => {
    if (ref) {
      setComplete(ref.complete);
      ref.onload = () => {
        setFade(true);
      };
    }
  };
  let imgRender;
  if (!lazyload) {
    imgRender = (
      <ItemImage
        ref={imgRef}
        className="fade-done-enter"
        src={`//cdn.soapphoto.com/${detail.key}${pictureStyle[size]}`}
      />
    );
  } else {
    imgRender = (
      <CSSTransition
        in={isFade}
        timeout={0}
        classNames={{
          appear: 'fade-appear',
          appearActive: 'fade-active-appear',
          appearDone: 'fade-done-appear',
          enter: 'fade-enter',
          enterActive: 'fade-active-enter',
          enterDone: 'fade-done-enter',
        }}
        // unmountOnExit
        transitionEnter={false}
        transitionLeave={false}
      >
        <ItemImage
          ref={imgRef}
          src={`//cdn.soapphoto.com/${detail.key}${pictureStyle[size]}`}
        />
      </CSSTransition>
    );
  }
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
