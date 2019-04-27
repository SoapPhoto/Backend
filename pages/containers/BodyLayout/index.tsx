import * as React from 'react';

import { Wapper } from './styles';

export const BodyLayout = ({ children }) => {
  return (
    <Wapper>
      {children}
    </Wapper>
  );
};
