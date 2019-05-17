import * as React from 'react';

export interface ILinkProps {
  color?: string;
  size?: string | number;
}

export const Link: React.FC<ILinkProps> = ({
  color = 'currentColor',
  size = '24',
  ...restProps
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      {...restProps}
    >
      <path fill="none" d="M0 0h24v24H0z"/>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M13.06 8.11l1.415 1.415a7 7 0 0 1 0 9.9l-.354.353a7 7 0 0 1-9.9-9.9l1.415 1.415a5 5 0 1 0 7.071 7.071l.354-.354a5 5 0 0 0 0-7.07l-1.415-1.415 1.415-1.414zm6.718 6.011l-1.414-1.414a5 5 0 1 0-7.071-7.071l-.354.354a5 5 0 0 0 0 7.07l1.415 1.415-1.415 1.414-1.414-1.414a7 7 0 0 1 0-9.9l.354-.353a7 7 0 0 1 9.9 9.9z"/>
    </svg>
  );
};
