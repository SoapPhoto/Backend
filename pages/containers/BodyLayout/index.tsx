import * as React from 'react';

import { Header } from '../Header';
import { Wapper } from './styles';

interface IProps {
  header: boolean;
}

export const BodyLayout: React.FC<IProps> = ({ children, header = true }) => {
  return (
    <Wapper>
      {
        header ?
        <Header /> :
        <div />
      }
      {children}
    </Wapper>
  );
};
