import * as React from 'react';
import { Label, LabelBox, StyleInput } from './styles';

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 显示的标题
   *
   * @type {string}
   * @memberof IInputProps
   */
  label?: string;
  /**
   * 输入框的Ref
   *
   * @type {React.Ref<HTMLInputElement>}
   * @memberof IInputProps
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * 回车执行的事件
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e
   * @memberof IInputProps
   */
  onPressEnter?(e: React.KeyboardEvent<HTMLInputElement>): void;
}

type Component = React.FC<IInputProps>;

export const Input: Component = ({
  onPressEnter,
  onKeyDown,
  label,
  inputRef,
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
        ref={inputRef}
        onKeyDown={handleKeyDown}
        {...restProps}
      />
    </LabelBox>
  );
};
