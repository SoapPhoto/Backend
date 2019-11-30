import Head from 'next/head';
import React, { useEffect, useCallback, useState } from 'react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getTitle, Histore } from '@lib/common/utils';
import {
  Avatar, GpsImage, EmojiText, LightBox, SEO,
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
  const [commentLoading, setCommentLoading] = useState(true);
  const {
    info, like, getComment, comment, addComment, updateInfo, deletePicture, isCollected, setPicture,
  } = pictureStore;
  const { user, tags, bio } = info;
  const isOwner = (userInfo && userInfo.id.toString() === user.id.toString()) || false;

  useEffect(() => {
    (async () => {
      setCommentLoading(true);
      try {
        await getComment();
      } finally {
        setCommentLoading(false);
      }
    })();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLocation = info.exif && info.exif.location && info.exif.location.length > 0;
  const onConfirm = async (value: string, commentId?: ID) => {
    await addComment(value, commentId);
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
  const deletes = useCallback(async () => {
    await deletePicture();
    // 删除后返回用户首页
    window.location.href = `/@${user.username}`;
  }, [deletePicture, user.username]);
  const title = getTitle(`${info.title} (@${user.name})`, t);
  return (
    <Wrapper>
      <Head>
        <script
          type="text/javascript"
          src="https://webapi.amap.com/maps?v=1.4.14&key=e55a0b1eb15adb1ff24cec5a7aacd637"
        />
      </Head>
      <SEO
        title={title}
        itemprop={{
          image: `http:${getPictureUrl(info.key, 'itemprop')}`,
        }}
        description={`${bio ? `${bio}-` : ''}${user.name}所拍摄的照片。`}
      />
      <UserHeader columns={2}>
        <UserInfo width={1}>
          <UserLink route={`/@${user.username}`}>
            <Avatar
              style={{ marginRight: rem(14) }}
              src={user.avatar}
              size={44}
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
        <PictureImage lazyload={false} size="regular" detail={info} />
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
          deletePicture={deletes}
          isCollected={isCollected}
          setPicture={setPicture}
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
        {/* <MarkdownContent /> */}
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
      {/* {
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
      } */}
      <Comment onConfirm={onConfirm} comment={comment} loading={commentLoading} />
      <LightBox
        visible={boxVisible}
        src={getPictureUrl(info.key, 'full')}
        onClose={closeLightBox}
        size={{
          width: info.width,
          height: info.height,
        }}
      />
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
    const data = Histore!.get('modal');
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
