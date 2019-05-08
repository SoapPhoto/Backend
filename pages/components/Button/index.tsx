import * as React from 'react';
import { StyleButton } from './styles';

type Component = React.SFC<React.ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button: Component = (props) => {
  return (
    <StyleButton
      {...props}
    />
  );
};
