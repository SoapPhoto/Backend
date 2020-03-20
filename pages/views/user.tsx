import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import parse from 'url-parse';
import { rem } from 'polished';
import { Cell } from 'styled-css-grid';
import { useRouter as useBaseRouter } from 'next/router';
import qs from 'querystring';

import { IBaseScreenProps, ICustomNextPage, ICustomNextContext } from '@lib/common/interfaces/global';
import { getTitle, Histore } from '@lib/common/utils';
import {
  Avatar, Nav, NavItem, EmojiText, SEO,
} from '@lib/components';
import { withError } from '@lib/components/withError';
import { PictureList } from '@lib/containers/Picture/List';
import { Link as LinkIcon, BadgeCert, StrutAlign } from '@lib/icon';
import { Popover } from '@lib/components/Popover';
import { UserFollowModal } from '@lib/components/UserFollowModal';
import {
  Bio,
  EditIcon,
  Profile,
  ProfileItem,
  ProfileItemLink,
  UserHeader,
  UserName,
  Wrapper,
  HeaderGrid,
  AvatarBox,
  Info,
  InfoItem,
  InfoItemCount,
  InfoItemLabel,
  InfoBox,
  AvatarContent,
} from '@lib/styles/views/user';
import { WithRouterProps } from 'next/dist/client/with-router';
import { A } from '@lib/components/A';
import { CollectionList } from '@lib/containers/Collection/List';
import { UserType } from '@common/enum/router';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useAccountStore, useStores } from '@lib/stores/hooks';
import { useTranslation } from '@lib/i18n/useTranslation';
import { FollowButton } from '@lib/components/Button/FollowButton';
import { useFollower } from '@lib/common/hooks/useFollower';
import { useRouter } from '@lib/router';
import { WithQueryParam } from '@lib/components/WithQueryParam';

interface IProps extends IBaseScreenProps, WithRouterProps {
  username: string;
  type: UserType;
}

interface IUserInfoProps {
  openModal: (type: string) => void;
}

const server = !!(typeof window === 'undefined');

const User = observer<ICustomNextPage<IProps, {}>>(({ type }) => {
  const { screen } = useStores();
  const { t } = useTranslation();
  const { userStore, userCollectionStore } = screen;
  const { user } = userStore;
  return (
    <Wrapper>
      <SEO
        title={getTitle(`${user.fullName} (@${user.username})`, t)}
        description={`${user.bio ? `${user.bio}-` : ''}查看${user.name}的Soap照片。`}
      />
      <UserInfo />
      <Nav>
        <NavItem route={`/@${user.username}`}>
          {t('user.menu.picture')}
        </NavItem>
        <NavItem route={`/@${user.username}/like`}>
          {t('user.menu.like')}
        </NavItem>
        <NavItem route={`/@${user.username}/collections`}>
          {t('user.menu.collection')}
        </NavItem>
      </Nav>
      {
        type === 'collections' ? (
          <CollectionList
            list={userCollectionStore.list}
            noMore={userCollectionStore.isNoMore}
          />
        ) : (
          <Picture />
        )
      }
    </Wrapper>
  );
});

const UserInfo = observer(() => {
  const {
    query, pathname, params,
  } = useRouter();
  const { push } = useBaseRouter();
  const [follow, followLoading] = useFollower();
  const { t } = useTranslation();
  const { screen } = useStores();
  const { isLogin, userInfo } = useAccountStore();
  const { userStore } = screen;
  const {
    user, watch, setUsername, username,
  } = userStore;
  useEffect(() => {
    if (params.username !== username) {
      setUsername(params.username!);
    }
    const clear = watch();
    return () => clear();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.username]);
  const pushModalQuery = useCallback((label: string) => {
    push(`/views/user?${qs.stringify(params as any)}`, `${pathname}?action=${label}`, {
      shallow: true,
    });
    Histore.set('modal', `child-${label}`);
  }, [params, pathname, push]);
  const openModal = useCallback((type: string) => {
    pushModalQuery(type);
  }, [pushModalQuery]);
  const backNow = useCallback(() => {
    push(`/views/user?${qs.stringify(params as any)}`, pathname, {
      shallow: true,
    });
  }, [params, pathname, push]);
  const follower = useCallback(() => user && follow(user), [follow, user]);
  return (
    <UserHeader>
      <HeaderGrid columns="140px auto" gap="32px">
        <AvatarContent>
          <AvatarBox>
            {/* <Christmas size={64} /> */}
          </AvatarBox>
          <Avatar src={user.avatar} size={140} />
        </AvatarContent>
        <Cell>
          <UserName>
            <EmojiText
              text={user.fullName}
            />
            {
              user.badge.find(v => v.name === 'user-cert') && (
                <StrutAlign>
                  <Popover
                    openDelay={100}
                    trigger="hover"
                    placement="top"
                    theme="dark"
                    content={<span>认证用户</span>}
                  >
                    <BadgeCert size={32} style={{ marginLeft: rem(6) }} />
                  </Popover>
                </StrutAlign>
              )
            }
            {
              isLogin && userInfo?.username === user.username && (
                <A route="/setting/profile">
                  <EditIcon size={18} />
                </A>
              )
            }
            {
              userInfo?.username !== user.username && (
                <FollowButton
                  disabled={followLoading}
                  user={user}
                  style={{ marginLeft: rem(24), marginRight: rem(24) }}
                  isFollowing={user.isFollowing}
                  onClick={follower}
                />
              )
            }
          </UserName>
          <Profile>
            {
              user.website && (
                <ProfileItem>
                  <ProfileItemLink href={user.website} target="__blank">
                    <LinkIcon size={14} />
                    {parse(user.website).hostname}
                  </ProfileItemLink>
                </ProfileItem>
              )
            }
          </Profile>
          <Bio>
            {user.bio}
          </Bio>
          <InfoBox>
            <Info>
              <InfoItem click={1} onClick={() => openModal('follower')}>
                <InfoItemCount>{user.followerCount}</InfoItemCount>
                <InfoItemLabel>{t('user.label.followers')}</InfoItemLabel>
              </InfoItem>
              <InfoItem click={1} onClick={() => openModal('followed')}>
                <InfoItemCount>{user.followedCount}</InfoItemCount>
                <InfoItemLabel>{t('user.label.followed')}</InfoItemLabel>
              </InfoItem>
              <InfoItem>
                <InfoItemCount>{user.likesCount}</InfoItemCount>
                <InfoItemLabel>{t('user.label.likes')}</InfoItemLabel>
              </InfoItem>
            </Info>
          </InfoBox>
        </Cell>
      </HeaderGrid>
      <WithQueryParam action="follower" back={backNow}>
        {(visible, backView) => (
          <UserFollowModal
            type="follower"
            userId={user.id}
            visible={visible}
            onClose={backView}
          />
        )}
      </WithQueryParam>
      <WithQueryParam action="followed" back={backNow}>
        {(visible, backView) => (
          <UserFollowModal
            type="followed"
            userId={user.id}
            visible={visible}
            onClose={backView}
          />
        )}
      </WithQueryParam>
    </UserHeader>
  );
});

const Picture = observer(() => {
  const { screen } = useStores();
  const { userPictureStore } = screen;
  const { type: PictureType, list } = userPictureStore;
  return (
    <PictureList
      noMore={list[PictureType].isNoMore}
      data={list[PictureType].list}
      like={list[PictureType].like}
      onPage={list[PictureType].getPageList}
    />
  );
});

User.getInitialProps = async ({
  mobxStore, route, res,
}: ICustomNextContext) => {
  const { params, query, pathname } = route;
  const { username, type } = params as { username: string; type: UserType };
  const { appStore, screen } = mobxStore;
  const { userCollectionStore, userPictureStore, userStore } = screen;
  const { location } = appStore;
  const all = [];
  const arg: [string, UserType] = [username!, type];
  const isPop = location && location.action === 'POP' && !server;
  if (query.modal) {
    if (query.action !== 'follower' && query.action !== 'followed') res?.redirect(pathname);
  }
  userCollectionStore.setUsername(username!);
  userStore.setUsername(username!);
  if (isPop) {
    all.push(userStore.getCache(username));
  } else {
    all.push(userStore.getInit(...arg));
  }
  switch (type!) {
    case UserType.collections:
      all.push(
        userCollectionStore.getList(false),
      );
      break;
    default:
      all.push(isPop ? userPictureStore.getCache(...arg) : userPictureStore.getList(...arg));
  }
  await Promise.all(all);
  return {
    type,
    username: params.username,
  };
};

export default withError(pageWithTranslation([I18nNamespace.User, I18nNamespace.Collection])(User));
