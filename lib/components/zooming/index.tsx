import React, { useEffect } from 'react';
import Zoom from 'zooming';

export const Zooming: React.FC<any> = ({ children }) => {
  useEffect(() => {
    const zooming = new Zoom({
      // options...
    });

    zooming.listen('img');
  });
  return children;
};
