import { Input as BaseInput } from '@pages/components/Input';
import React, { useEffect } from 'react';
import { PlusCircle, X } from 'react-feather';
import styled from 'styled-components';

interface IProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Tag = styled.span<{close?: boolean}>`
  position: relative;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: ${_ => _.theme.colors.secondary};
  border: 1px solid ${_ => _.theme.colors.gray};
  border-radius: 4px;
  font-size: 12px;
  font-variant: tabular-nums;
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  padding: 0 7px;
  font-size: 14px;
  line-height: 30px;
  background: ${_ => _.theme.colors.lightgray};
  border-radius: 2px;
  margin-right: 12px;
  margin-bottom: 12px;
  & svg {
    stroke: ${_ => _.theme.colors.secondary};
  }
`;

const XIcon = styled(X)`
  margin-left: 6px;
  cursor: pointer;
`;

const PlusIcon = styled(PlusCircle)`
  margin-right: 6px;
`;

const Input = styled(BaseInput)`
  background-color: transparent;
  border-color: transparent !important;
  box-shadow: none !important;
  height: auto;
  line-height: 24px;
  font-size: 14px;
  padding: 0;
`;

export default function ({
  value,
  onChange,
}: IProps) {
  const [isClick, setClick] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isClick && inputRef.current) {
      inputRef.current.focus();
    }
  },        [isClick]);

  const click = () => {
    setClick(true);
  };

  const blur = () => {
    setClick(false);
  };

  const deleteTag = (tag: string) => onChange(value.filter(item => item !== tag));

  const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onChange([...new Set([...value, inputRef.current!.value])]);
    inputRef.current!.value = '';
  };

  return (
    <Wrapper>
      {
        value.map(e => (
          <Tag key={e} close>
            {e}
            <XIcon onClick={() => deleteTag(e)} size={12} />
          </Tag>
        ))
      }
      <Tag style={{ width: '120px', textAlign: 'center' }} onClick={click}>
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
}
