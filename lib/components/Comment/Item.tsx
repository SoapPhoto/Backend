import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import { rem } from 'polished';
import { css } from 'styled-components';
import day from 'dayjs';

import { CommentEntity } from '@lib/common/interfaces/comment';
import { UserPopper } from '@lib/containers/Picture/components/UserPopper';
import { A } from '../A';
import { Avatar, EmojiText } from '..';
import { Popover } from '../Popover';
import { CommentEditor } from './Editor';
import {
  ContentBox, InfoBox, ItemBox, MainBox, UserName,
} from './styles/list';
import { CommentList } from './List';

interface ICommentItem {
  comment: CommentEntity;
  onConfirm: (value: string, commentId?: string) => Promise<void>;
}

export const CommentItem: React.FC<ICommentItem> = observer(({
  comment,
  onConfirm,
}) => {
  const [isComment, setComment] = useState(false);
  console.log(comment);
  const {
    user, id, content, createTime, childComments, replyUser, replyComment,
  } = comment;
  const openComment = useCallback(() => {
    setComment(!isComment);
  }, [isComment]);
  const addComment = useCallback(async (commentContent: string) => (
    onConfirm(commentContent, comment.id)
  ), [comment.id, onConfirm]);
  return (
    <ItemBox key={id}>
      <UserPopper username={user.username}>
        <A
          route={`/@${user.username}`}
        >
          <Avatar src={user.avatar} />
        </A>
      </UserPopper>
      <MainBox>
        <ContentBox>
          <div>
            <A
              route={`/@${user.username}`}
              css={css`text-decoration: none;` as any}
            >
              <UserName>
                <EmojiText
                  text={user.fullName}
                />
              </UserName>
            </A>
          </div>
          <div>
            {
              !!(replyComment && replyUser) && (
                <span>
  回复
                  {' '}
                  { replyUser.fullName }
                  {' '}
：
                </span>
              )
            }
            <EmojiText
              text={content}
            />
          </div>
        </ContentBox>
        <InfoBox>
          <Popover
            openDelay={100}
            trigger="hover"
            placement="top"
            theme="dark"
            content={<span>{day(createTime).format('YYYY-MM-DD HH:mm:ss')}</span>}
          >
            <p>{day(createTime).fromNow()}</p>
          </Popover>
          <span css={css`font-family: monospace;`}> · </span>
          <span
            css={css`cursor: pointer;`}
            onClick={openComment}
          >
          回复
          </span>
        </InfoBox>
        {
          isComment && (
            <div css={css`margin-top: ${rem(12)};`}>
              <CommentEditor
                onConfirm={addComment}
                placeholder={`回复@${user.fullName}`}
              />
            </div>
          )
        }
        {
          childComments && childComments.length > 0 && (
            <CommentList onConfirm={addComment} comment={childComments} />
          )
        }
      </MainBox>
    </ItemBox>
  );
});
