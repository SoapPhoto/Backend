import * as React from 'react';
import { StyleInput } from './styles';

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPressEnter?(e: React.KeyboardEvent<HTMLInputElement>): void;
}

type Component = React.SFC<IInputProps>;

export const Input: Component = ({
  onPressEnter,
  onKeyDown,
  ...restProps
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };
  return (
    <StyleInput
      onKeyDown={handleKeyDown}
      {...restProps}
    />
  );
};
