import React from 'react';
import { LinkProps } from 'next-routes';
import { Link } from '@lib/routes';

interface IAProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, LinkProps {}

export const A: React.FC<IAProps> = ({
  children,
  route,
  params,
  ...restProps
}) => (
  <Link route={route} params={params}>
    <a {...restProps} href={route}>
      {children}
    </a>
  </Link>
);
