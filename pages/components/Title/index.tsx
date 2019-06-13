import React from 'react';

import { title } from '@pages/common/constants/config';

export const HeadTitle: React.FC = ({ children }) => (
  <title>{children} - {title}</title>
);
