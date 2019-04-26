import BaseLink from 'next/link';
import * as React from 'react';

export const Link = ({ to, children }) => {
  return (
    <BaseLink
      href={`views/${to}`}
      as={to}
    >
      {children}
    </BaseLink>
  );
};
