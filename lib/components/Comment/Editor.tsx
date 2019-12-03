import React, {
  useCallback, useRef, useState, useEffect,
} from 'react';

import { connect } from '@lib/common/utils/store';
import { AccountStore } from '@lib/stores/AccountStore';
import { rem } from 'polished';
import { useTranslation } from '@lib/i18n/useTranslation';
import { isIn } from '@lib/common/utils';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Textarea } from '../Input';
import {
  HandleBox, Wrapper, Box, AvatarBox,
} from './styles/editor';

interface IProps {
  child?: boolean;
  accountStore?: AccountStore;
  onConfirm: (value: string) => Promise<void>;
  onClose?: () => void;
  placeholder?: string;
}

export const CommentEditor = connect<React.FC<IProps>>('accountStore')(({
  child = false,
  accountStore,
  placeholder,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { userInfo } = accountStore!;
  const setInputFocus = useCallback(() => {
    inputRef.current!.focus();
  }, []);
  useEffect(() => {
    if (inputRef.current && child) inputRef.current.focus();
    const ifEl = (e: MouseEvent) => {
      if (!isIn(e.target as Node, wrapperRef.current!) && onClose) {
        setTimeout(() => onClose(), 100);
      }
    };
    if (child) {
      document.addEventListener('mousedown', ifEl);
      return () => document.removeEventListener('mousedown', ifEl);
    }
    return () => null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);
  const onConfirmClick = useCallback(async () => {
    setLoading(true);
    try {
      await onConfirm(value);
      if (!child) setValue('');
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      if (!child) setLoading(false);
    }
  }, [child, onConfirm, value]);
  return (
    <Wrapper ref={wrapperRef}>
      <AvatarBox>
        <Avatar style={{ marginRight: rem(12) }} src={userInfo!.avatar} />
      </AvatarBox>
      <Box>
        <Textarea
          value={value}
          minRows={1}
          placeholder={placeholder || t('comment.placeholder')}
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
          <Button loading={loading} onClick={onConfirmClick} disabled={!value}>{t('comment.send')}</Button>
        </HandleBox>
      </Box>
    </Wrapper>
  );
});
