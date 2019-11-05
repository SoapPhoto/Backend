import React from 'react';
import { LinkProps } from 'next-routes';
import { Link } from '@lib/routes';
import styled from 'styled-components';
import { theme } from '@lib/common/utils/themes';

interface IAProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, LinkProps {}

const AComponent = styled.a`
  color: ${theme('colors.primary')};
  text-decoration: none;
`;

export const A: React.FC<IAProps> = ({
  children,
  route,
  params,
  ...restProps
}) => (
  <Link route={route} params={params}>
    <AComponent {...restProps} href={route}>
      {children}
    </AComponent>
  </Link>
);
