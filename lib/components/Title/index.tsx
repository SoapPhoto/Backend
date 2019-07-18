import React from 'react';

import { title } from '@lib/common/constants/config';

export const HeadTitle: React.FC = ({ children }) => {
  console.log(children, title);
  return (
    <title>{children} - {title}</title>
  );
};
