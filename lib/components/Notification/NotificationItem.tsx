import React, { useCallback } from 'react';
import { NotificationEntity } from '@lib/common/interfaces/notification';
import styled, { css } from 'styled-components';
import { NotificationCategory } from '@common/enum/notification';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getPictureUrl } from '@lib/common/utils/image';
import { rem } from 'polished';
import { theme } from '@lib/common/utils/themes';
import dayjs from 'dayjs';
import { Avatar } from '..';
import { EmojiText } from '../EmojiText';
import { Image } from '../Image';
import { A } from '../A';
import { Popover } from '../Popover';

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
  ${
  _ => (!_.read ? css`
    background: ${theme('styles.notification.read.background')};
    ` : '')
}
`;

const User = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled(EmojiText)`
  font-weight: 700;
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

export const NotificationItem: React.FC<IProps> = ({ data }) => {
  const content = useCallback(() => {
    switch (data.category) {
      case NotificationCategory.LIKED:
        return '喜欢了你的照片 ❤️';
      case NotificationCategory.COMMENT:
        return '评论了你的照片 😁';
      default:
        return '';
    }
  }, [data.category]);
  const handle = useCallback(() => {
    if (data.category === NotificationCategory.LIKED || data.category === NotificationCategory.COMMENT) {
      const { key, id } = data.media as PictureEntity;
      return (
        <Picture route={`/picture/${id}`}>
          <Image src={getPictureUrl(key)} />
        </Picture>
      );
    }
    return null;
  }, [data.category, data.media]);
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
};
