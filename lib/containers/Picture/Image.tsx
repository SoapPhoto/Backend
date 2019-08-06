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
  const [isFade, setFade] = useState(false);
  const image = useRef<Maybe<HTMLImageElement>>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isComplete, setComplete] = useState(false);
  const height = (1 - (detail.width - detail.height) / detail.width) * 100 || 100;
  useEffect(() => () => {
    if (image.current) {
      image.current.onload = null;
    }
  }, []);
  const imgRef = (ref: HTMLImageElement) => {
    if (ref) {
      image.current = ref;
      setComplete(image.current.complete);
      image.current.onload = () => {
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
        src={getPictureUrl(detail.key, size)}
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
          src={getPictureUrl(detail.key, size)}
        />
      </CSSTransition>
    );
  }
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
