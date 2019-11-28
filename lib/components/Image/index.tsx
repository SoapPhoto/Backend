import React, {
  useState, useEffect, memo, useCallback,
} from 'react';
import { server } from '@lib/common/utils';

export type IImageProps = React.ImgHTMLAttributes<HTMLImageElement>

const imageCache: Record<string, boolean> = {};

const inImageCache = (url: string) => imageCache[url] || false;

const activateCacheForImage = (url: string) => imageCache[url] = true;

export const Image: React.FC<IImageProps> = memo(({
  src, alt, className, title, ...restProps
}) => {
  const [isFadeIn, setFadeIn] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const handleImageLoaded = useCallback(() => {
    activateCacheForImage(src!);
    setLoaded(true);
  }, [src]);
  useEffect(() => {
    const image = document.createElement('img');
    image.src = src!;
    if (image.complete || inImageCache(src!)) {
      handleImageLoaded();
      image.onload = null;
    } else {
      setFadeIn(true);
      image.onload = () => {
        handleImageLoaded();
      };
    }
    return () => { image.onload = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const shouldReveal = !isFadeIn || isLoaded || server;
  const imageStyle = {
    opacity: shouldReveal ? 1 : 0,
    transition: isFadeIn ? 'opacity 300ms' : 'none',
  };
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      title={title}
      style={imageStyle}
      {...restProps}
    />
  );
});
