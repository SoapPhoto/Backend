import { isFunction } from 'lodash';
import { rem } from 'polished';
import React, { useEffect } from 'react';
import { PlusCircle, X } from 'react-feather';
import styled, { css } from 'styled-components';

import { Input as BaseInput } from '@lib/components/Input';
import { theme } from '@lib/common/utils/themes';

interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> {
  value: string[];
  onChange?: (tags: string[]) => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Tag = styled.span<{close?: boolean;edit?: boolean}>`
  position: relative;
  box-sizing: border-box;
  color: ${theme('colors.text')};
  font-weight: 600;
  border: 1px solid ${theme('colors.gray')};
  border-radius: ${rem('20px')};
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  font-variant: tabular-nums;
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  padding: ${rem('4px')} ${rem('20px')};
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  background: ${theme('colors.lightgray')};
  ${_ => (
    _.edit ? css`
      font-size: ${rem(_.theme.fontSizes[1])};
      height: ${rem('32px')};
    ` : css`
      &:hover {
        background: ${_.theme.colors.primary};
        border-color: ${_.theme.colors.primary};
        color: ${_.theme.colors.pure};
      }
  `
  )}
  transition: .2s background ease, .2s border-color ease, .2s color ease;
  & svg {
    stroke: ${theme('colors.text')};
  }
`;

const XIcon = styled(X)`
  margin-left: ${rem('6px')};
  cursor: pointer;
`;

const PlusIcon = styled(PlusCircle)`
  margin-right: ${rem('6px')};
`;

const Input = styled(BaseInput)`
  input {
    background-color: transparent;
    border-color: transparent !important;
    box-shadow: none !important;
    height: auto;
    line-height: ${rem('20px')};
    font-size: ${_ => rem(theme('fontSizes[1]')(_))};
    padding: 0;
  }
`;

const TagContent: React.FC<IProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  const [isClick, setClick] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isClick && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isClick]);

  const click = () => {
    setClick(true);
  };

  const blur = () => {
    setClick(false);
  };

  const deleteTag = (tag: string) => isFunction(onChange) && onChange(value.filter(item => item !== tag));

  const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFunction(onChange)) {
      onChange([...new Set([...value, inputRef.current!.value])]);
    }
    inputRef.current!.value = '';
  };
  console.log(2, value);
  return (
    <Wrapper {...restProps}>
      {
        value.map(e => (
          <Tag
            edit
            style={{
              marginRight: rem(12),
              marginBottom: rem(12),
            }}
            key={e}
            close
          >
            {e}
            <XIcon onClick={() => deleteTag(e)} size={12} />
          </Tag>
        ))
      }
      <Tag
        style={{
          width: '120px', textAlign: 'center', marginRight: '12px', marginBottom: '12px',
        }}
        onClick={click}
        edit
      >
        {
          !isClick ? (
            <>
              <PlusIcon size={14} />
              <span>添加标签</span>
            </>
          ) : (
            <Input inputRef={inputRef} onBlur={blur} onPressEnter={keyDown} />
          )
        }
      </Tag>
    </Wrapper>
  );
};
export default TagContent;
