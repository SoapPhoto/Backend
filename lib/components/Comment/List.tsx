import React from 'react';
import { observer } from 'mobx-react';

import { CommentEntity } from '@lib/common/interfaces/comment';
import { AccountStore } from '@lib/stores/AccountStore';
import { Wrapper } from './styles/list';
import { CommentItem } from './Item';

interface IProps {
  accountStore?: AccountStore;
  comment: CommentEntity[];
  onConfirm: (value: string, commentId?: string) => Promise<void>;
}

export const CommentList: React.FC<IProps> = observer(({
  comment,
  onConfirm,
}) => (
  <Wrapper>
    {
      comment.map(data => (
        <CommentItem onConfirm={onConfirm} key={data.id} comment={data} />
      ))
    }
  </Wrapper>
));
