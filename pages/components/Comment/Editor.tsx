import React, { useCallback, useRef, useState } from 'react';

import { connect } from '@pages/common/utils/store';
import { AccountStore } from '@pages/stores/AccountStore';
import { rem } from 'polished';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Textarea } from '../Input';
import { HandleBox, Wrapper } from './styles/editor';

interface IProps {
  accountStore?: AccountStore;
  value: string;
  onConfirm: () => Promise<void>;
  onChange: (value: string) => void;
}

export const CommentEditor = connect<React.FC<IProps>>('accountStore')(({
  accountStore,
  value,
  onChange,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { userInfo } = accountStore!;
  const setInputFocus = useCallback(() => {
    inputRef.current!.focus();
  }, []);
  const onInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  const onConfirmClick = useCallback(async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }, [onConfirm]);
  return (
    <Wrapper>
      <Avatar src={userInfo!.avatar} />
      <div>
        <Textarea
          value={value}
          minRows={1}
          placeholder="输入评论"
          boxStyle={{
            paddingBottom: rem('48px'),
          }}
          onChange={onInputChange}
          inputRef={inputRef}
        />
        <HandleBox
          onClick={setInputFocus}
        >
          <span />
          <Button loading={loading} onClick={onConfirmClick} disabled={!value}>评论</Button>
        </HandleBox>
      </div>
    </Wrapper>
  );
});
