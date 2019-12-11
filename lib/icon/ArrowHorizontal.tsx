/* eslint-disable max-len */
import React from 'react';

import { IIconProps } from './type';

export const ArrowHorizontal: React.FC<IIconProps> = ({
  size = 24, color = 'currentcolor', ...otherProps
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 20 18"
    style={{ color }}
    {...otherProps}
  >
    <path d="M18.5 4.5H2.5M18.5 4.5L15 1M18.5 4.5L15 8M1.5 13.5H17.5M1.5 13.5L5 10M1.5 13.5L5 17" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
