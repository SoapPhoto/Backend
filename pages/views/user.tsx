import { observer } from 'mobx-react';
import React from 'react';
import parse from 'url-parse';
import { NextSeo } from 'next-seo';

import { IBaseScreenProps, ICustomNextPage, ICustomNextContext } from '@lib/common/interfaces/global';
import { getTitle } from '@lib/common/utils';
import {
  Avatar, Nav, NavItem, EmojiText,
} from '@lib/components';
import { withError } from '@lib/components/withError';
import { PictureList } from '@lib/containers/Picture/List';
import { Link as LinkIcon } from '@lib/icon';
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
} from '@lib/styles/views/user';
import { WithRouterProps } from 'next/dist/client/with-router';
import { withRouter } from 'next/router';
import { Cell } from 'styled-css-grid';
import { A } from '@lib/components/A';
import { CollectionList } from '@lib/containers/Collection/List';
import { UserType } from '@common/enum/router';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useAccountStore, useStores } from '@lib/stores/hooks';
import { useTranslation } from '@lib/i18n/useTranslation';

interface IProps extends IBaseScreenProps, WithRouterProps {
  username: string;
  type: UserType;
}

const server = !!(typeof window === 'undefined');

const User = observer<ICustomNextPage<IProps, {}>>(({ type }) => {
  const { screen } = useStores();
  const { isLogin, userInfo } = useAccountStore();
  const { t } = useTranslation();
  const { userStore, userCollectionStore, userPictureStore } = screen;
  const { user } = userStore;
  return (
    <Wrapper>
      <NextSeo
        title={getTitle(`${user.fullName} (@${user.username})`, t)}
        description={user.bio}
      />
      <UserHeader>
        <HeaderGrid columns="140px auto" gap="32px">
          <AvatarBox>
            <Avatar src={user.avatar} size={140} />
          </AvatarBox>
          <Cell>
            <UserName>
              <EmojiText
                text={user.fullName}
              />
              {
                isLogin && userInfo && userInfo.username === user.username
                && (
                  <A route="/setting/profile">
                    <EditIcon size={18} />
                  </A>
                )
              }
            </UserName>
            <Profile>
              {
                user.website
                && (
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
          </Cell>
        </HeaderGrid>
      </UserHeader>
      <Nav>
        <NavItem route={`/@${user.username}`}>
          {t('user_menu.picture')}
        </NavItem>
        <NavItem route={`/@${user.username}/like`}>
          {t('user_menu.like')}
        </NavItem>
        <NavItem route={`/@${user.username}/collections`}>
          {t('user_menu.collection')}
        </NavItem>
      </Nav>
      {
        type === 'collections' ? (
          <CollectionList
            list={userCollectionStore.list}
            noMore={userCollectionStore.isNoMore}
          />
        ) : (
          <PictureList
            noMore={userPictureStore.isNoMore}
            data={userPictureStore.list}
            like={userPictureStore.like}
            onPage={userPictureStore.getPageList}
          />
        )
      }
    </Wrapper>
  );
});

User.getInitialProps = async ({
  mobxStore, route,
}: ICustomNextContext) => {
  const { params } = route;
  const { username, type } = params as { username: string; type: UserType };
  const { appStore, screen } = mobxStore;
  const { userCollectionStore, userPictureStore, userStore } = screen;
  const { location } = appStore;
  const all = [];
  const arg: [string, UserType] = [username!, type];
  const isPop = location && location.action === 'POP' && !server;
  if (isPop) {
    all.push(userStore.getCache(username));
  } else {
    all.push(userStore.getInit(...arg));
  }
  switch (type!) {
    case UserType.collections:
      all.push(
        userCollectionStore.getList(username!),
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

export default withRouter(withError(pageWithTranslation([I18nNamespace.User, I18nNamespace.Collection])(User)));
