import React from 'react';

import { CommentEntity } from '@pages/common/interfaces/comment';
import { connect } from '@pages/common/utils/store';
import { AccountStore } from '@pages/stores/AccountStore';
import { Avatar } from '../Avatar';
import { CommentEditor } from './Editor';
import { CommentList } from './List';
import { Wrapper } from './styles';

interface IProps {
  accountStore?: AccountStore;
  comment: CommentEntity[];
}

export const Comment = connect<React.FC<IProps>>('accountStore')(({
  accountStore,
  comment,
}) => {
  const { isLogin } = accountStore!;
  return (
    <Wrapper>
      {
        isLogin &&
        <CommentEditor />
      }
      <CommentList comment={comment} />
    </Wrapper>
  );
});
