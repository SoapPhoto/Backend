import day from 'dayjs';
import React from 'react';
import { observer } from 'mobx-react';

import { A } from '@lib/components/A';
import { UserPopper } from '@lib/containers/Picture/components/UserPopper';
import { CommentEntity } from '@lib/common/interfaces/comment';
import { AccountStore } from '@lib/stores/AccountStore';
import { css } from 'styled-components';
import { Avatar } from '../Avatar';
import { Popover } from '../Popover';
import {
  ContentBox, InfoBox, ItemBox, MainBox, UserName, Wrapper,
} from './styles/list';
import { EmojiText } from '..';

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
          <UserPopper username={user.username}>
            <A
              route={`/@${user.username}`}
            >
              <Avatar src={user.avatar} />
            </A>
          </UserPopper>
          <MainBox>
            <ContentBox>
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
              <EmojiText
                text={content}
              />
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
            </InfoBox>
          </MainBox>
        </ItemBox>
      ))
    }
  </Wrapper>
));
