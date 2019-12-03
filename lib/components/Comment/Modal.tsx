import React, { useEffect, useState, useCallback } from 'react';
import { rem } from 'polished';
import styled from 'styled-components';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useApolloClient } from 'react-apollo';

import { ChildComments } from '@lib/schemas/query';
import { theme } from '@lib/common/utils/themes';
import { CommentEntity } from '@lib/common/interfaces/comment';
import { IPaginationList } from '@lib/common/interfaces/global';
import { X } from '@lib/icon';
import { AddComment } from '@lib/schemas/mutations';
import { queryToMobxObservable } from '@lib/common/apollo';
import { UserEntity } from '@lib/common/interfaces/user';
import { customMedia } from '@lib/common/utils/mediaQuery';
import { Modal } from '..';
import { CommentList } from './List';
import { IconButton } from '../Button';
import { Empty } from '../Empty';

interface IProps {
  id: ID;
  author: UserEntity;
  visible: boolean;
  onClose: () => void;
  comment?: CommentEntity;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${rem(14)};
  border-bottom: 1px solid ${theme('colors.shadowColor')};
`;

const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
`;

const Content = styled(OverlayScrollbarsComponent)`
  flex: 1;
  background-color: ${theme('colors.background')};
  /* max-height: 100%; */
`;

const CommentListBox = styled.div`
  padding: ${rem(14)};
  /* background-color: ${theme('colors.pure')}; */
`;

const XButton = styled(X)`
  color: ${theme('colors.text')};
`;

const ModalContent = styled(Modal)`
  padding: 0 !important;
  max-width: rem(600) !important;
  height: calc(100vh - ${rem(24 * 2)}) !important;
  margin: ${rem(24)} auto !important;
  ${customMedia.lessThan('mobile')`
    height: 80vh !important;
    margin-top: 20vh !important;
    margin-bottom: 0 !important;
    border-top-left-radius: 4px !important;
    border-top-right-radius: 4px !important;
  `}
`;

export const CommentModal: React.FC<IProps> = ({
  id,
  author,
  visible,
  onClose,
  comment,
}) => {
  const client = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<CommentEntity[]>();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (visible && comment) {
      (async () => {
        setLoading(true);
        queryToMobxObservable(client.watchQuery<{childComments: IPaginationList<CommentEntity>}>({
          query: ChildComments,
          fetchPolicy: 'cache-and-network',
          variables: {
            id: comment.id,
            query: {
              page: 1,
              pageSize: 50,
            },
          },
        }), (data) => {
          setList(data.childComments.data);
          setCount(data.childComments.count);
          setLoading(false);
        });
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment, visible]);
  const addComment = useCallback(async (content: string, commentId?: string) => {
    const { data } = await client.mutate<{addComment: CommentEntity}>({
      mutation: AddComment,
      variables: {
        id,
        commentId,
        data: {
          content,
        },
      },
    });
    setList((state) => {
      state!.push(data!.addComment);
      return state;
    });
    setCount(state => state + 1);
  }, [client, id]);
  return (
    <ModalContent
      visible={visible}
      onClose={onClose}
      closeIcon={false}
    >
      {
        (loading || !list || !comment) ? (
          <Empty loading />
        ) : (
          <Wrapper>
            <Header>
              <Title>{`评论 · ${count}条评论`}</Title>
              <IconButton onClick={onClose}>
                <XButton />
              </IconButton>
            </Header>
            <Content
              options={{ scrollbars: { autoHide: 'leave' }, sizeAutoCapable: false }}
            >
              <CommentListBox>
                <CommentList
                  parent={comment}
                  author={author}
                  onConfirm={addComment}
                  comment={list}
                />
              </CommentListBox>
            </Content>
          </Wrapper>
        )
      }
    </ModalContent>
  );
};
