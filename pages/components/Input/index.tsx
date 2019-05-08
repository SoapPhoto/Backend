import * as React from 'react';
import { StyleInput } from './styles';

type Component = React.SFC<React.InputHTMLAttributes<HTMLInputElement>>;

export const Input: Component = (props) => {
  return (
    <StyleInput
      {...props}
    />
  );
};
