import * as React from 'react';

import { Header } from '../Header';
import { Wapper } from './styles';

export const BodyLayout: React.SFC = ({ children }) => {
  return (
    <Wapper>
      <Header />
      {children}
    </Wapper>
  );
};
