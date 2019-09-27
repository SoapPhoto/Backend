import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import React from 'react';
import parse from 'url-parse';

import { ICustomNextContext, IBaseScreenProps } from '@lib/common/interfaces/global';
import { getTitle } from '@lib/common/utils';
import {
  Avatar, Nav, NavItem, EmojiText,
} from '@lib/components';
import { withError } from '@lib/components/withError';
import { PictureList } from '@lib/containers/Picture/List';
import { Link as LinkIcon } from '@lib/icon';
import { AccountStore } from '@lib/stores/AccountStore';
import { IMyMobxStore } from '@lib/stores/init';
import { UserScreenStore } from '@lib/stores/screen/User';
import { UserScreenPictureList } from '@lib/stores/screen/UserList';
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
import { computed } from 'mobx';
import { WithRouterProps } from 'next/dist/client/with-router';
import { withRouter } from 'next/router';
import { Cell } from 'styled-css-grid';
import { A } from '@lib/components/A';
import { UserScreenCollectionList } from '@lib/stores/screen/UserCollections';
import { CollectionList } from '@lib/containers/Collection/List';
import { UserType } from '@common/enum/router';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { I18nContext } from '@lib/i18n/I18nContext';

interface IProps extends IBaseScreenProps, WithRouterProps {
  username: string;
  userStore: UserScreenStore;
  picturesStore: UserScreenPictureList;
  collectionsStore: UserScreenCollectionList;
  accountStore: AccountStore;
  type: UserType;
}

const server = !!(typeof window === 'undefined');

@inject((stores: IMyMobxStore) => ({
  userStore: stores.screen.userStore,
  picturesStore: stores.screen.userPictureStore,
  collectionsStore: stores.screen.userCollectionStore,
  accountStore: stores.accountStore,
}))
@observer
class User extends React.Component<IProps> {
  public static getInitialProps: (_: ICustomNextContext) => any;

  constructor(props: IProps) {
    super(props);
  }

  @computed get type() {
    const { userStore } = this.props;
    return userStore.type;
  }

  public parseWebsite = (url: string) => {
    const data = parse(url);
    return data.hostname;
  }

  public render() {
    const {
      accountStore, userStore, picturesStore, collectionsStore, type,
    } = this.props;
    const { isLogin, userInfo } = accountStore;
    const { user } = userStore;
    return (
      <I18nContext.Consumer>
        {
          ({ t }) => (
            <Wrapper>
              <Head>
                <title>{getTitle(`${user.fullName} (@${user.username})`, t)}</title>
              </Head>
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
                              {this.parseWebsite(user.website)}
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
                    list={collectionsStore.list}
                    noMore={collectionsStore.isNoMore}
                  />
                ) : (
                  <PictureList
                    noMore={picturesStore.isNoMore}
                    data={picturesStore.list}
                    like={picturesStore.like}
                    onPage={picturesStore.getPageList}
                  />
                )
              }
            </Wrapper>
          )
        }
      </I18nContext.Consumer>
    );
  }
}

User.getInitialProps = async ({
  mobxStore, route,
}: ICustomNextContext) => {
  const { params } = route;
  const { username, type } = params as { username: string; type: UserType };
  const { appStore, screen } = mobxStore;
  const { userCollectionStore, userPictureStore, userStore } = screen;
  const { location } = appStore;
  let error: {
    message: string;
    statusCode: number;
  } | undefined;
  const all = [];
  const arg: [string, UserType] = [username!, type!];
  const isPop = location && location.action === 'POP' && !server;
  if (!(userStore.username && userStore.username === username)) {
    if (isPop) {
      all.push(userStore.getCache(username));
    } else {
      all.push(userStore.getInit(...arg));
    }
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
    error,
    type,
    username: params.username,
  };
};

export default withRouter(withError(pageWithTranslation([I18nNamespace.User, I18nNamespace.Collection])(User)));
