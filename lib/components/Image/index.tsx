import React, { useState, useEffect } from 'react';

export type IImageProps = React.ImgHTMLAttributes<HTMLImageElement>

export const Image: React.FC<IImageProps> = ({ src, alt, ...restProps }) => {
  const [complete, setComplete] = useState(false);
  const [isLoad, setLoad] = useState(false);
  useEffect(() => {
    const image = document.createElement('img');
    image.src = src!;
    if (image.complete) {
      setComplete(image.complete);
    } else {
      image.onload = () => {
        setLoad(true);
      };
    }
    return () => { if (image) image.onload = null; };
  }, [src]);
  const transition = `${complete ? '0s' : '1s'} opacity ease`;
  return (
    <img
      style={{ opacity: (isLoad || complete) ? 1 : 0, transition }}
      src={src}
      alt={alt}
      {...restProps}
    />
  );
};
