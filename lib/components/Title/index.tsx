import React from 'react';

import { title } from '@lib/common/constants/config';

export const HeadTitle: React.FC = ({ children }) => (
  <title>
    {children}
    {' '}
-
    {' '}
    {title}
  </title>
);
