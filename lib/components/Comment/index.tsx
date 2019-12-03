import React, { useState, useCallback } from 'react';
import { useAccountStore } from '@lib/stores/hooks';
import { observer } from 'mobx-react';

import { CommentEntity } from '@lib/common/interfaces/comment';
import { AccountStore } from '@lib/stores/AccountStore';
import { UserEntity } from '@lib/common/interfaces/user';
import { CommentEditor } from './Editor';
import { CommentList } from './List';
import { Wrapper } from './styles';
import { Empty } from '..';
import { CommentModal } from './Modal';

interface IProps {
  id: ID;
  author: UserEntity;
  accountStore?: AccountStore;
  comment: CommentEntity[];
  loading?: boolean;
  onConfirm: (value: string, commentId?: string) => Promise<void>;
}

export const Comment = observer(({
  id,
  author,
  comment,
  onConfirm,
  loading,
}) => {
  const { isLogin } = useAccountStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalState, setStateModal] = useState<CommentEntity>();
  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);
  const openModal = useCallback((data: CommentEntity) => {
    setStateModal(data);
    setModalVisible(true);
  }, []);
  return (
    <Wrapper>
      {
        isLogin && (
          <CommentEditor onConfirm={onConfirm} />
        )
      }
      <CommentList
        author={author}
        onConfirm={onConfirm}
        comment={comment}
        openModal={openModal}
      />
      {
        (loading || (!loading && comment.length === 0)) && (
          <Empty emptyText="暂无评论！" loading={loading} />
        )
      }
      <CommentModal id={id} comment={modalState} visible={modalVisible} onClose={closeModal} />
    </Wrapper>
  );
});
