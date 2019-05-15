import * as React from 'react';
import { Label, LabelBox, StyleInput } from './styles';

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onPressEnter?(e: React.KeyboardEvent<HTMLInputElement>): void;
}

type Component = React.FC<IInputProps>;

export const Input: Component = ({
  onPressEnter,
  onKeyDown,
  label,
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
    <LabelBox>
      {
        label &&
        <Label>{label}</Label>
      }
      <StyleInput
        onKeyDown={handleKeyDown}
        {...restProps}
      />
    </LabelBox>
  );
};
