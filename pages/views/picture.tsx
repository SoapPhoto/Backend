import Head from 'next/head';
import React, { useEffect, useCallback } from 'react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getTitle } from '@lib/common/utils';
import { Avatar, GpsImage, EmojiText } from '@lib/components';
import { Comment } from '@lib/components/Comment';
import { PictureInfo } from '@lib/components/PictureInfo';
import { Tag } from '@lib/components/Tag';
import { withError } from '@lib/components/withError';
import { PictureImage } from '@lib/containers/Picture/Image';
import { Eye, Heart } from '@lib/icon';
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
import { rem } from 'polished';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore, useScreenStores } from '@lib/stores/hooks';
import { observer } from 'mobx-react';

interface IInitialProps extends IBaseScreenProps {
  screenData: PictureEntity;
}

const Picture: ICustomNextPage<IInitialProps, any> = observer(() => {
  const { userInfo } = useAccountStore();
  const { pictureStore } = useScreenStores();
  const { t } = useTranslation();
  const {
    info, like, getComment, comment, addComment, updateInfo, deletePicture,
  } = pictureStore;
  const { user, tags } = info;
  const isOwner = (userInfo && userInfo.id === user.id) || false;

  useEffect(() => {
    getComment();
  }, [getComment]);

  const isLocation = info.exif && info.exif.location && info.exif.location.length > 0;
  const onConfirm = async (value: string) => {
    await addComment(value);
  };
  const onOk = useCallback((picture: PictureEntity) => {
    updateInfo(picture);
  }, [updateInfo]);
  return (
    <Wrapper>
      <Head>
        <title>{getTitle(`${info.title} (@${user.username})`, t)}</title>
        <script
          type="text/javascript"
          src="https://webapi.amap.com/maps?v=1.4.14&key=e55a0b1eb15adb1ff24cec5a7aacd637"
        />
      </Head>
      <UserHeader columns={2}>
        <UserInfo width={1}>
          <UserLink route={`/@${user.username}`}>
            <Avatar
              style={{ marginRight: rem(14) }}
              src={user.avatar}
            />
            <UserName>
              <EmojiText
                text={user.fullName}
              />
            </UserName>
          </UserLink>
        </UserInfo>
        <UserHeaderInfo width={1}>
          <BaseInfoItem
            style={{ marginRight: rem(14) }}
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
        <Title>
          <EmojiText
            text={info.title}
          />
        </Title>
        <PictureInfo
          info={info}
          isOwner={isOwner}
          onLike={like}
          onOk={onOk}
          deletePicture={deletePicture}
        />
        {
          tags.length > 0
          && (
            <TagBox>
              {
                tags.map(tag => (
                  <A
                    style={{ textDecoration: 'none' }}
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
              <EmojiText
                text={info.bio}
              />
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
});

/// TODO: mobx-react@6 @inject 不执行 getIInitialProps 的暂时解决方案
Picture.getInitialProps = async ({ mobxStore, route, req }: ICustomNextContext) => {
  const { params } = route;
  const { appStore } = mobxStore;
  const isPicture = (
    mobxStore.screen.pictureStore.id
    && mobxStore.screen.pictureStore.id === Number(params.id || 0)
  );
  let isPop = false;
  if (appStore.location) {
    if (appStore.location.action === 'POP') isPop = true;
    if (
      appStore.location.options
      && appStore.location.options.state
      && /^child/g.test(appStore.location.options.state.data)
    ) isPop = true;
  }
  if (isPicture && isPop && mobxStore.screen.pictureStore.isCache(params.id)) {
    mobxStore.screen.pictureStore.getCache();
    // mobxStore.screen.pictureStore.getPictureInfo(
    //   params.id!,
    //   req ? req.headers : undefined,
    // );
    return {};
  }
  await mobxStore.screen.pictureStore.getPictureInfo(
    params.id!,
    req ? req.headers : undefined,
  );
  return {};
};

export default withError(
  pageWithTranslation(I18nNamespace.Picture)(
    Picture,
  ),
);
