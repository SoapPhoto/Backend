import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { server } from '@lib/common/utils';

export type IImageProps = React.ImgHTMLAttributes<HTMLImageElement>

export const Image: React.FC<IImageProps> = memo(({
  src, alt, className, title,
}) => {
  const [complete, setComplete] = useState(false);
  const [isLoad, setLoad] = useState(false);
  useEffect(() => {
    const image = document.createElement('img');
    image.src = src!;
    if (image.complete) {
      setComplete(image.complete);
      setLoad(true);
      image.onload = null;
    } else {
      image.onload = () => {
        setLoad(true);
      };
    }
    return () => { if (image) image.onload = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (complete || server) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ opacity: 1 }}
        className={className}
        title={title}
      />
    );
  }
  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      {(isLoad) && (
        <motion.img
          transition={{
            type: 'spring',
            damping: 10,
            stiffness: 100,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={src}
          alt={alt}
          className={className}
          title={title}
        // {...restProps}
        />
      )}
    </AnimatePresence>
  );
});
