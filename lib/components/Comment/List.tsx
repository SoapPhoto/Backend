import moment from 'moment';
import React, { memo } from 'react';
import { Emojione } from 'react-emoji-render';

import { CommentEntity } from '@lib/common/interfaces/comment';
import { connect } from '@lib/common/utils/store';
import { AccountStore } from '@lib/stores/AccountStore';
import { Avatar } from '../Avatar';
import { Popover } from '../Popover';
import { ContentBox, InfoBox, ItemBox, MainBox, UserName, Wrapper } from './styles/list';

interface IProps {
  accountStore?: AccountStore;
  comment: CommentEntity[];
}

export const CommentList = connect<React.FC<IProps>>('accountStore')(({
  accountStore,
  comment,
}) => {
  return (
    <Wrapper>
      {
        comment.map(({ user, id, content, createTime }) => (
          <ItemBox key={id}>
            <Avatar src={user.avatar} />
            <MainBox>
              <ContentBox>
                <UserName>{user.username}</UserName>
                <Emojione
                  svg
                  text={content}
                />
              </ContentBox>
              <InfoBox>
                <Popover
                  openDelay={100}
                  trigger="hover"
                  placement="top"
                  theme="dark"
                  content={<span>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</span>}
                >
                  <p>{moment(createTime).from()}</p>
                </Popover>
              </InfoBox>
            </MainBox>
          </ItemBox>
        ))
      }
    </Wrapper>
  );
});
