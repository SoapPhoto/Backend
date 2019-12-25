import React, { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { css } from 'styled-components';
import { rem } from 'polished';
import { theme } from '@lib/common/utils/themes';
import {
  ErrorBox, Label, LabelBox, StyleInput,
} from './styles';

export * from './Textarea';

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 显示的标题
   *
   * @type {string}
   * @memberof IInputProps
   */
  label?: string;
  /**
   * 错误
   *
   * @type {string}
   * @memberof IInputProps
   */
  error?: string;
  /**
   * 输入框的Ref
   *
   * @type {React.Ref<HTMLInputElement>}
   * @memberof IInputProps
   */
  inputRef?: React.Ref<HTMLInputElement>;

  type?: 'password';

  /**
   * 是否是必填字段
   *
   * @type {boolean}
   * @memberof IInputProps
   */
  required?: boolean;

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
  style,
  error,
  type = 'input',
  className,
  required = false,
  ...restProps
}) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  }, [onKeyDown, onPressEnter]);
  return (
    <LabelBox style={style} className={className}>
      {
        label && (
          <Label>
            {
              required && (
                <span css={css`margin-right: ${rem(4)};color: ${theme('colors.danger')}`}>*</span>
              )
            }
            <span>{label}</span>
          </Label>
        )
      }
      <StyleInput
        ref={inputRef}
        onKeyDown={handleKeyDown}
        error={!!error}
        type={type === 'password' ? 'password' : undefined}
        {...restProps}
      />
      <AnimatePresence>
        {
          error && (
            <ErrorBox
              initial={{ opacity: 0, transform: 'translateY(-100%)' }}
              animate={{ opacity: 1, transform: 'translateY(0%)' }}
              exit={{ opacity: 0 }}
            >
              {error}
            </ErrorBox>
          )
        }
      </AnimatePresence>
    </LabelBox>
  );
};
