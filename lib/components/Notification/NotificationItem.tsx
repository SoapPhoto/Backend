import React, { useCallback } from 'react';
import { NotificationEntity } from '@lib/common/interfaces/notification';
import styled from 'styled-components';
import { NotificationCategory } from '@common/enum/notification';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getPictureUrl } from '@lib/common/utils/image';
import { rem } from 'polished';
import { theme } from '@lib/common/utils/themes';
import { Avatar } from '..';
import { EmojiText } from '../EmojiText';
import { Image } from '../Image';
import { A } from '../A';

interface IProps {
  data: NotificationEntity;
}

const Item = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  grid-gap: ${rem(12)};
`;

const User = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled(EmojiText)`
  font-weight: 700;
  margin-left: ${rem(8)};
  color: ${theme('colors.text')};
`;

const Content = styled.p`

`;

const Handle = styled.div``;

const Picture = styled(A)`
  display: block;
  width: ${rem(30)};
  height: ${rem(30)};
  overflow: hidden;
  border-radius: 2px;
  & > img {
    width: 100%;
    height: 100%;
    font-family: "object-fit:cover";
    object-fit: cover;
  }
`;

export const NotificationItem: React.FC<IProps> = ({ data }) => {
  const content = useCallback(() => {
    switch (data.category) {
      case NotificationCategory.LIKED:
        return '喜欢了你的照片';
      default:
        return '';
    }
  }, [data.category]);
  const handle = useCallback(() => {
    if (data.category === NotificationCategory.LIKED) {
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
    <Item>
      <User>
        <A route={`/@${data.publisher.username}`}>
          <Avatar size={32} src={data.publisher.avatar} />
        </A>
        <A route={`/@${data.publisher.username}`}>
          <UserName text={data.publisher.fullName} />
        </A>
      </User>
      <Content>
        {content()}
        <span>{}</span>
      </Content>
      <Handle>{handle()}</Handle>
    </Item>
  );
};
