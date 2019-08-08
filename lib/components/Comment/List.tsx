import moment from 'moment';
import React from 'react';
import { Emojione } from 'react-emoji-render';
import { observer } from 'mobx-react';

import { CommentEntity } from '@lib/common/interfaces/comment';
import { AccountStore } from '@lib/stores/AccountStore';
import { Avatar } from '../Avatar';
import { Popover } from '../Popover';
import {
  ContentBox, InfoBox, ItemBox, MainBox, UserName, Wrapper,
} from './styles/list';

interface IProps {
  accountStore?: AccountStore;
  comment: CommentEntity[];
}

export const CommentList: React.FC<IProps> = observer(({
  comment,
}) => (
  <Wrapper>
    {
      comment.map(({
        user, id, content, createTime,
      }) => (
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
));
