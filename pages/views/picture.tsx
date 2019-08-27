import Head from 'next/head';
import React, { useEffect } from 'react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getTitle } from '@lib/common/utils';
import { connect } from '@lib/common/utils/store';
import { Avatar, GpsImage } from '@lib/components';
import { Comment } from '@lib/components/Comment';
import { PictureInfo } from '@lib/components/PictureInfo';
import { Tag } from '@lib/components/Tag';
import { withError } from '@lib/components/withError';
import { PictureImage } from '@lib/containers/Picture/Image';
import { Eye, Heart } from '@lib/icon';
import { AccountStore } from '@lib/stores/AccountStore';
import { IMyMobxStore } from '@lib/stores/init';
import { PictureScreenStore } from '@lib/stores/screen/Picture';
import { ThemeStore } from '@lib/stores/ThemeStore';
import {
  BaseInfoItem,
  Bio,
  Content,
  GpsCotent,
  PictureBox,
  TagBox,
  Title,
  UserHeader,
  UserHeaderInfo,
  UserInfo,
  UserLink,
  UserName,
  Wrapper,
} from '@lib/styles/views/picture';
import { A } from '@lib/components/A';
import { css } from 'styled-components';
import { rem } from 'polished';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';

interface IInitialProps extends IBaseScreenProps {
  screenData: PictureEntity;
}

interface IProps extends IInitialProps {
  accountStore: AccountStore;
  themeStore: ThemeStore;
  pictureStore: PictureScreenStore;
}

const Picture: ICustomNextPage<IProps, any> = ({
  pictureStore,
  accountStore,
}) => {
  const {
    info, like, getComment, comment, addComment,
  } = pictureStore;
  const { userInfo } = accountStore;
  const { user, tags } = info;
  const isOwner = (userInfo && userInfo.id === user.id) || false;

  useEffect(() => {
    getComment();
  }, []);

  const isLocation = info.exif && info.exif.location && info.exif.location.length > 0;
  const onConfirm = async (value: string) => {
    await addComment(value);
  };
  return (
    <Wrapper>
      <Head>
        <title>{getTitle(`${info.title} (@${user.username})`)}</title>
        <script
          type="text/javascript"
          src="https://webapi.amap.com/maps?v=1.4.14&key=e55a0b1eb15adb1ff24cec5a7aacd637"
        />
      </Head>
      <UserHeader columns={2}>
        <UserInfo width={1}>
          <UserLink route={`/@${user.username}`}>
            <Avatar
              css={css`
                margin-right: ${rem(14)};
              `}
              src={user.avatar}
            />
            <UserName>{user.name}</UserName>
          </UserLink>
        </UserInfo>
        <UserHeaderInfo width={1}>
          <BaseInfoItem
            css={css`
              margin-right: ${rem(14)};
            `}
          >
            <Eye size={20} />
            <p>{info.views}</p>
          </BaseInfoItem>
          <BaseInfoItem>
            <Heart size={20} />
            <p>{info.likes}</p>
          </BaseInfoItem>
        </UserHeaderInfo>
      </UserHeader>
      <PictureBox>
        <PictureImage size="full" detail={info} />
      </PictureBox>
      <Content>
        <Title>{info.title}</Title>
        <PictureInfo
          info={info}
          isOwner={isOwner}
          onLike={like}
        />
        {
          tags.length > 0
          && (
            <TagBox>
              {
                tags.map(tag => (
                  <A
                    css={css`
                      text-decoration: none;
                    `}
                    route={`/tag/${tag.name}`}
                    key={tag.id}
                  >
                    <Tag>
                      {tag.name}
                    </Tag>
                  </A>
                ))
              }
            </TagBox>
          )
        }
        {
          info.bio && (
            <Bio>
              {info.bio}
            </Bio>
          )
        }
        {
          isLocation && (
            <GpsCotent>
              <GpsImage gps={info!.exif!.location!} />
            </GpsCotent>
          )
        }
      </Content>
      <Comment onConfirm={onConfirm} comment={comment} />
    </Wrapper>
  );
};

/// TODO: mobx-react@6 @inject 不执行 getIInitialProps 的暂时解决方案
Picture.getInitialProps = async ({ mobxStore, route, req }: ICustomNextContext) => {
  const { params } = route;
  const isPicture = (
    mobxStore.screen.pictureStore.id
    && mobxStore.screen.pictureStore.id === Number(params.id || 0)
  );
  const isPop = mobxStore.appStore.location && mobxStore.appStore.location.action === 'POP';
  if (isPicture && isPop && mobxStore.screen.pictureStore.isCache(params.id)) {
    mobxStore.screen.pictureStore.getCache();
    mobxStore.screen.pictureStore.getPictureInfo(
      params.id!,
      req ? req.headers : undefined,
    );
    return {};
  }
  await mobxStore.screen.pictureStore.getPictureInfo(
    params.id!,
    req ? req.headers : undefined,
  );
  return {};
};

export default withError<IProps>(
  connect((stores: IMyMobxStore) => ({
    pictureStore: stores.screen.pictureStore,
    accountStore: stores.accountStore,
    themeStore: stores.themeStore,
  }))(pageWithTranslation(I18nNamespace.Message)(Picture)),
);
