import Head from 'next/head';
import React, {
  useEffect, useCallback, useState, useMemo,
} from 'react';

import { ICustomNextContext, ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { getTitle, Histore } from '@lib/common/utils';
import {
  Avatar, GpsImage, EmojiText, LightBox, SEO,
} from '@lib/components';
import { Comment } from '@lib/components/Comment';
import { PictureInfo } from '@lib/components/PictureInfo';
import { withError } from '@lib/components/withError';
import { PictureImage } from '@lib/containers/Picture/Image';
import {
  Heart, MessageSquare, Target, Award, StrutAlign, Hash, Clock, ThumbsUp,
} from '@lib/icon';
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
  MapIcon,
  PictureWrapper,
  UserHeaderWrapper,
  UserHeaderHandleBox,
  LocationBox,
  TagA,
  CommentWrapper,
  TimeSpan,
  Choice,
} from '@lib/styles/views/picture';
import { rem } from 'polished';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore, useScreenStores } from '@lib/stores/hooks';
import { observer } from 'mobx-react';
import { getPictureUrl, formatLocationTitle } from '@lib/common/utils/image';
import dayjs from 'dayjs';
import { Popover } from '@lib/components/Popover';
import { FollowButton } from '@lib/components/Button/FollowButton';
import { useFollower } from '@lib/common/hooks/useFollower';

interface IInitialProps extends IBaseScreenProps {
  screenData: PictureEntity;
}

const Picture: ICustomNextPage<IInitialProps, any> = observer(() => {
  const { userInfo } = useAccountStore();
  const { pictureStore } = useScreenStores();
  const { t } = useTranslation();
  const [follow, followLoading] = useFollower();
  const [boxVisible, setBoxVisible] = useState(false);
  const [commentLoading, setCommentLoading] = useState(true);
  const {
    info, like, getComment, comment, addComment, updateInfo, deletePicture, isCollected, setPicture, watch,
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
      const clear = watch();
      return () => clear();
    })();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.id]);

  const isLocation = info.exif && info.exif.location && info.exif.location.length > 0;
  const onConfirm = async (value: string, commentId?: number) => {
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

  const title = useMemo(() => getTitle(`${info.title} (@${user.name})`, t), [info.title, t, user.name]);

  const locationTitle = useMemo(() => {
    if (info?.location) {
      return formatLocationTitle(info.location);
    }
    return '';
  }, [info]);

  const num = useMemo(() => info.width / info.height, [info.height, info.width]);

  return (
    <Wrapper>
      <Head>
        <script
          type="text/javascript"
          src="https://webapi.amap.com/maps?v=1.4.14&key=e55a0b1eb15adb1ff24cec5a7aacd637"
        />
        <meta property="weibo:image:full_image" content={getPictureUrl(info.key, 'full')} />
        <meta name="weibo:image:create_at" content={info.createTime.toString()} />
        <meta name="weibo:image:update_at" content={info.updateTime.toString()} />
      </Head>
      <SEO
        title={title}
        itemprop={{
          image: `http:${getPictureUrl(info.key, 'itemprop')}`,
        }}
        description={`${bio ? `${bio}-` : ''}${user.name}所拍摄的照片。`}
        openGraph={{
          type: 'image',
          url: `${process.env.URL}/picture/${info.id}`,
          title,
          description: `${bio ? `${bio}-` : ''}${user.name}所拍摄的照片。`,
          images: [
            {
              url: `http:${getPictureUrl(info.key, 'small')}`,
            },
          ],
        }}
      />
      <UserHeaderWrapper>
        <UserHeader columns={2}>
          <UserInfo width={1}>
            <UserLink route={`/@${user.username}`}>
              <Avatar
                style={{ marginRight: rem(14) }}
                src={user.avatar}
                badge={user.badge}
                size={44}
              />
            </UserLink>
            <div>
              <UserLink style={{ marginBottom: rem(4) }} route={`/@${user.username}`}>
                <UserName>
                  <EmojiText
                    text={user.fullName}
                  />
                </UserName>
              </UserLink>
            </div>
          </UserInfo>
          <UserHeaderHandleBox>
            <FollowButton
              disabled={followLoading}
              // size="small"
              user={user}
              isFollowing={info.user.isFollowing}
              onClick={() => follow(user)}
            />
          </UserHeaderHandleBox>
          {/* <UserHeaderInfo width={1}>
            <BaseInfoItem
              style={{ marginRight: rem(14) }}
            >
              <Target
                color="#57aae7"
                style={{ strokeWidth: 2.5 }}
                size={20}
              />
              <p>{info.views}</p>
            </BaseInfoItem>
            <BaseInfoItem
              style={{ marginRight: rem(14) }}
            >
              <Heart
                color="#e71a4d"
                style={{ strokeWidth: 2.5 }}
                size={20}
              />
              <p>{info.likedCount}</p>
            </BaseInfoItem>
            <BaseInfoItem>
              <MessageSquare
                color="#c155f4"
                style={{ strokeWidth: 2.5 }}
                size={20}
              />
              <p>{info.commentCount}</p>
            </BaseInfoItem>
          </UserHeaderInfo> */}
        </UserHeader>
      </UserHeaderWrapper>
      <PictureWrapper>
        <PictureBox num={num} onClick={openLightBox}>
          <PictureImage lazyload={false} size="regular" detail={info} />
        </PictureBox>
      </PictureWrapper>
      <Content>
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
          info.title && (
            <Title>
              {
                info.badge?.findIndex(v => v.name === 'choice') >= 0 && (
                  <Choice>
                    <StrutAlign>
                      <Popover
                        openDelay={100}
                        trigger="hover"
                        placement="top"
                        theme="dark"
                        content={<span>{t('label.choice')}</span>}
                      >
                        <ThumbsUp style={{ marginTop: '-2px' }} color="#ff9500" size={28} />
                      </Popover>
                    </StrutAlign>
                  </Choice>
                )
              }
              <EmojiText
                text={info.title}
              />
            </Title>
          )
        }
        {
          tags.length > 0 && (
            <TagBox>
              {
                tags.map(tag => (
                  <TagA
                    style={{ textDecoration: 'none' }}
                    route={`/tag/${tag.name}`}
                    key={tag.id}
                  >
                    <Hash size={14} />
                    {tag.name}
                  </TagA>
                ))
              }
            </TagBox>
          )
        }
        <BaseInfoItem>
          <Popover
            openDelay={100}
            trigger="hover"
            placement="top"
            theme="dark"
            content={<span>{dayjs(info.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>}
          >
            <TimeSpan>
              <StrutAlign>
                <Clock size={14} />
              </StrutAlign>
              {dayjs(info.createTime).fromNow()}
            </TimeSpan>
          </Popover>
        </BaseInfoItem>
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
              {
                locationTitle && (
                  <LocationBox>
                    <MapIcon size={14} />
                    {locationTitle}
                  </LocationBox>
                )
              }
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
      <CommentWrapper>
        <Comment id={info.id} author={info.user} onConfirm={onConfirm} comment={comment} loading={commentLoading} />
      </CommentWrapper>
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
    await mobxStore.screen.pictureStore.getCache(Number(params.id!));
    return {};
  }
  await mobxStore.screen.pictureStore.getPictureInfo(Number(params.id!));
  return {};
};

export default withError(
  pageWithTranslation(I18nNamespace.Picture)(
    Picture,
  ),
);
