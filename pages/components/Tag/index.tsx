import { Input as BaseInput } from '@pages/components/Input';
import { rem } from 'polished';
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
  border-radius: ${rem('4px')};
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  font-variant: tabular-nums;
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  padding: 0 ${rem('7px')};
  font-size: ${_ => rem(_.theme.fontSizes[1])};
  line-height: ${rem('30px')};
  background: ${_ => _.theme.colors.lightgray};
  border-radius: ${rem('2px')};
  margin-right: ${rem('12px')};
  margin-bottom: ${rem('12px')};
  & svg {
    stroke: ${_ => _.theme.colors.secondary};
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
  background-color: transparent;
  border-color: transparent !important;
  box-shadow: none !important;
  height: auto;
  line-height: ${rem('24px')};
  font-size: ${_ => rem(_.theme.fontSizes[1])};
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
  }, [isClick]);

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
