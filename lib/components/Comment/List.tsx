import React from 'react';
import { observer } from 'mobx-react';

import { CommentEntity } from '@lib/common/interfaces/comment';
import { AccountStore } from '@lib/stores/AccountStore';
import { UserEntity } from '@lib/common/interfaces/user';
import { Wrapper } from './styles/list';
import { CommentItem } from './Item';

interface IProps {
  parent?: CommentEntity;
  author: UserEntity;
  accountStore?: AccountStore;
  comment: CommentEntity[];
  onConfirm: (value: string, commentId?: string) => Promise<void>;
  openModal?: (data: CommentEntity) => void;
}

export const CommentList: React.FC<IProps> = observer(({
  parent,
  author,
  comment,
  onConfirm,
  openModal,
}) => (
  <Wrapper>
    {
      comment.map(data => (
        <CommentItem
          parent={parent}
          author={author}
          onConfirm={onConfirm}
          key={data.id}
          comment={data}
          openModal={openModal}
        />
      ))
    }
  </Wrapper>
));
