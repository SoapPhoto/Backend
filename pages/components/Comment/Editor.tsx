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
  onConfirm: (value: string) => Promise<void>;
}

export const CommentEditor = connect<React.FC<IProps>>('accountStore')(({
  accountStore,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { userInfo } = accountStore!;
  const setInputFocus = useCallback(() => {
    inputRef.current!.focus();
  }, []);
  const onInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);
  const onConfirmClick = useCallback(async () => {
    setLoading(true);
    try {
      await onConfirm(value);
    } finally {
      setLoading(false);
    }
  }, [value]);
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
