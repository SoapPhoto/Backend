import React from 'react';

import { CommentEntity } from '@lib/common/interfaces/comment';
import { connect } from '@lib/common/utils/store';
import { AccountStore } from '@lib/stores/AccountStore';
import { CommentEditor } from './Editor';
import { CommentList } from './List';
import { Wrapper } from './styles';

interface IProps {
  accountStore?: AccountStore;
  comment: CommentEntity[];
  onConfirm: (value: string) => Promise<void>;
}

export const Comment = connect<React.FC<IProps>>('accountStore')(({
  accountStore,
  comment,
  onConfirm,
}) => {
  const { isLogin } = accountStore!;
  return (
    <Wrapper>
      {
        isLogin
        && <CommentEditor onConfirm={onConfirm} />
      }
      <CommentList comment={comment} />
    </Wrapper>
  );
});
