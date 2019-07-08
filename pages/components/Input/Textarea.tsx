import { isFunction } from 'lodash';
import { rgba } from 'polished';
import React, { memo, useCallback, useState } from 'react';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';
import styled from 'styled-components';
import { ErrorBox, inputCss, Label, LabelBox } from './styles';

export interface ITextareaProps extends TextareaAutosizeProps {
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
  textareaStyle?: React.CSSProperties;
  boxStyle?: React.CSSProperties;
  focus?: boolean;
}

type Component = React.FC<ITextareaProps>;

const TextareaBox = styled.div<{ error?: boolean, focus?: boolean }>`
  ${inputCss}
  line-height: 24px;
  & textarea {
    width: 100%;
    resize:none;
    background: none;
    border: none;
    outline: 0;
    overflow: hidden;
    transition: .1s height ease;
    display: block;
    color: ${props => rgba(props.theme.colors.text, .7)};
  }
`;

export const Textarea: React.FC<ITextareaProps> = memo(({
  label,
  style,
  className,
  textareaStyle,
  boxStyle,
  error,
  ref,
  focus: inputFocus,
  onFocus,
  onBlur,
  minRows = 2,
  ...restProps
}) => {
  const [focus, setFocus] = useState(false);
  const onBaseFocus = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocus(true);
    if (isFunction(onFocus)) {
      onFocus(e);
    }
  }, [onFocus]);
  const onBasenBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocus(false);
    if (isFunction(onBlur)) {
      onBlur(e);
    }
  }, [onBlur]);
  return (
    <LabelBox style={style}>
      {
        label &&
        <Label>{label}</Label>
      }
      <TextareaBox
        className={className}
        error={!!error}
        focus={inputFocus !== undefined ? inputFocus : focus}
        style={boxStyle}
      >
        <TextareaAutosize
          minRows={minRows}
          style={textareaStyle}
          onFocus={onBaseFocus}
          onBlur={onBasenBlur}
          {...restProps}
        />
      </TextareaBox>
      {
        error &&
        <ErrorBox>{error}</ErrorBox>
      }
    </LabelBox>
  );
});
