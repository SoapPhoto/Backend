import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { rem } from 'polished';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';

import { NotificationEntity } from '@lib/common/interfaces/notification';
import { NotificationCategory } from '@common/enum/notification';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getPictureUrl } from '@lib/common/utils/image';
import { theme } from '@lib/common/utils/themes';
import { useFollower } from '@lib/common/hooks/useFollower';
import { Avatar } from '..';
import { EmojiText } from '../EmojiText';
import { Image } from '../Image';
import { A } from '../A';
import { Popover } from '../Popover';
import { FollowButton } from '../Button/FollowButton';

interface IProps {
  data: NotificationEntity;
}

const Item = styled.div<{read: number}>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  grid-gap: ${rem(12)};
  padding: 14px 18px;
  border-bottom: 1px solid ${theme('styles.box.borderColor')};
  ${_ => (!_.read ? css`
    background: ${theme('styles.notification.read.background')};
    ` as any : undefined)
}
`;

const User = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled(EmojiText)`
  font-weight: 600;
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  margin-left: ${rem(8)};
  color: ${theme('colors.text')};
`;

const Content = styled.p`
`;

const Handle = styled.div``;

const Picture = styled(A)`
  display: block;
  width: ${rem(40)};
  height: ${rem(40)};
  overflow: hidden;
  border-radius: 2px;
  & > img {
    width: 100%;
    height: 100%;
    font-family: "object-fit:cover";
    object-fit: cover;
  }
`;

const Date = styled.span`
  color: ${theme('colors.secondary')};
  margin-left: ${rem(8)};
`;

export const NotificationItem: React.FC<IProps> = observer(({ data }) => {
  const [follow, followLoading] = useFollower();
  const content = useCallback(() => {
    switch (data.category) {
      case NotificationCategory.LIKED:
        return '喜欢了你的照片';
      case NotificationCategory.COMMENT:
        if (data.comment) {
          return `评论了：${data.comment.content}`;
        }
        return '';
      case NotificationCategory.REPLY:
        if (data.comment) {
          return `回复了：${data.comment.content}`;
        }
        return '';
      case NotificationCategory.FOLLOW:
        return '关注了你';
      default:
        return '';
    }
  }, [data.category, data.comment]);
  const handle = useCallback(() => {
    if (
      data.category === NotificationCategory.LIKED
      || data.category === NotificationCategory.COMMENT
      || data.category === NotificationCategory.REPLY
    ) {
      let picture: PictureEntity | undefined;
      if (data.category === NotificationCategory.LIKED) {
        picture = data.picture;
      } else {
        picture = data.comment?.picture;
      }
      if (picture) {
        const { key, id } = picture;
        return (
          <Picture route={`/picture/${id}`}>
            <Image src={getPictureUrl(key, 'itemprop')} />
          </Picture>
        );
      }
      return (
        <div>此图片已删除</div>
      );
    }
    if (data.category === NotificationCategory.FOLLOW) {
      if (data.user) {
        const { isFollowing } = data.user;
        return (
          <FollowButton
            disabled={followLoading}
            size="small"
            isFollowing={isFollowing}
            onClick={() => follow(data.user!)}
          />
        );
      }
    }
    return null;
  }, [data.category, data.comment, data.picture, data.user, follow, followLoading]);
  return (
    <Item read={data.read ? 1 : 0}>
      <User>
        <A style={{ fontSize: 0 }} route={`/@${data.publisher.username}`}>
          <Avatar size={36} src={data.publisher.avatar} />
        </A>
        <A route={`/@${data.publisher.username}`} style={{ textDecoration: 'none' }}>
          <UserName text={data.publisher.fullName} />
        </A>
      </User>
      <Content>
        <EmojiText css={css`img {font-size: ${_ => rem(theme('fontSizes[2]')(_))};}` as any} text={content()} />
        <Popover
          openDelay={100}
          trigger="hover"
          placement="top"
          theme="dark"
          content={<span>{dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>}
        >
          <Date>{dayjs(data.createTime).fromNow()}</Date>
        </Popover>
      </Content>
      <Handle>{handle()}</Handle>
    </Item>
  );
});
