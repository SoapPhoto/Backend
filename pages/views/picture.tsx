import Head from 'next/head';
import React, { useEffect, useCallback, useState } from 'react';
import { NextSeo } from 'next-seo';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getTitle, Histore } from '@lib/common/utils';
import {
  Avatar, GpsImage, EmojiText, LightBox,
} from '@lib/components';
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
  GpsContent,
  PictureBox,
  TagBox,
  Title,
  UserHeader,
  UserHeaderInfo,
  UserInfo,
  UserLink,
  UserName,
  Wrapper,
  RelateCollection,
  RelateCollectionTitle,
  RelateCollectionList,
} from '@lib/styles/views/picture';
import { A } from '@lib/components/A';
import { rem } from 'polished';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore, useScreenStores } from '@lib/stores/hooks';
import { observer } from 'mobx-react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { CollectionItem } from '@lib/containers/Collection/Item';
import { getPictureUrl } from '@lib/common/utils/image';

interface IInitialProps extends IBaseScreenProps {
  screenData: PictureEntity;
}

const Picture: ICustomNextPage<IInitialProps, any> = observer(() => {
  const { userInfo } = useAccountStore();
  const { pictureStore } = useScreenStores();
  const { t } = useTranslation();
  const [boxVisible, setBoxVisible] = useState(false);
  const {
    info, like, getComment, comment, addComment, updateInfo, deletePicture, isCollected,
  } = pictureStore;
  const { user, tags, bio } = info;
  const isOwner = (userInfo && userInfo.id.toString() === user.id.toString()) || false;

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
  const openLightBox = useCallback(() => {
    setBoxVisible(true);
  }, []);
  const closeLightBox = useCallback(() => {
    setBoxVisible(false);
  }, []);
  const title = getTitle(`${info.title} (@${user.username})`, t);
  return (
    <Wrapper>
      <Head>
        <script
          type="text/javascript"
          src="https://webapi.amap.com/maps?v=1.4.14&key=e55a0b1eb15adb1ff24cec5a7aacd637"
        />
      </Head>
      <NextSeo
        title={title}
        description={bio}
      />
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
      <PictureBox onClick={openLightBox}>
        <PictureImage lazyload={false} size="full" detail={info} />
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
          isCollected={isCollected}
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
            <GpsContent>
              <GpsImage gps={info!.exif!.location!} />
            </GpsContent>
          )
        }
      </Content>
      {
        info.relatedCollections.count > 0 && (
          <RelateCollection>
            <RelateCollectionTitle>包含此图片的收藏夹</RelateCollectionTitle>
            <OverlayScrollbarsComponent
              options={{ scrollbars: { autoHide: 'leave' } }}
              style={{ paddingBottom: rem(12) }}
            >
              <RelateCollectionList>
                {
                  info.relatedCollections.data.map(ct => (
                    <CollectionItem key={ct.id} info={ct} />
                  ))
                }
              </RelateCollectionList>
            </OverlayScrollbarsComponent>
          </RelateCollection>
        )
      }
      <Comment onConfirm={onConfirm} comment={comment} />
      <LightBox visible={boxVisible} src={getPictureUrl(info.key, 'full')} onClose={closeLightBox} />
    </Wrapper>
  );
});

Picture.getInitialProps = async ({
  mobxStore, route,
}: ICustomNextContext) => {
  const { params } = route;
  const { appStore } = mobxStore;
  // const isPicture = (
  //   mobxStore.screen.pictureStore.id
  //   && mobxStore.screen.pictureStore.id === Number(params.id || 0)
  // );
  let isPop = false;
  let isChild = false;
  if (appStore.location) {
    if (appStore.location.action === 'POP') isPop = true;
    const data = Histore!.get('data');
    if (
      /^child/g.test(data)
    ) isChild = true;
  }
  if (isChild) return {};
  if (isPop) {
    await mobxStore.screen.pictureStore.getCache(params.id!);
    return {};
  }
  await mobxStore.screen.pictureStore.getPictureInfo(params.id!);
  return {};
};

export default withError(
  pageWithTranslation(I18nNamespace.Picture)(
    Picture,
  ),
);
