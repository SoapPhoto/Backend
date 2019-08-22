import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import React from 'react';
import parse from 'url-parse';

import { ICustomNextContext, IBaseScreenProps } from '@lib/common/interfaces/global';
import { getTitle } from '@lib/common/utils';
import { Avatar, Nav, NavItem } from '@lib/components';
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

  get name() {
    const { userStore } = this.props;
    const { user } = userStore;
    return user.name || user.username;
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
      <Wrapper>
        <Head>
          <title>{getTitle(`${this.name} (@${user.username})`)}</title>
        </Head>
        <UserHeader>
          <HeaderGrid columns="140px auto" gap="32px">
            <AvatarBox>
              <Avatar src={user.avatar} size={140} />
            </AvatarBox>
            <Cell>
              <UserName>
                {this.name}
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
            照片
          </NavItem>
          <NavItem route={`/@${user.username}/like`}>
            喜欢
          </NavItem>
          <NavItem route={`/@${user.username}/collections`}>
            收藏夹
          </NavItem>
        </Nav>
        {
          type === 'collections' ? (
            <CollectionList list={collectionsStore.list} />
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
    );
  }
}

User.getInitialProps = async ({
  mobxStore, req, route,
}: ICustomNextContext) => {
  const { params } = route;
  const { username, type } = params as { username: string; type: UserType };
  let error: {
    message: string;
    statusCode: number;
  } | undefined;
  const all = [];
  const arg: [string, UserType, any] = [username!, type!, req ? req.headers : undefined];
  const isPop = mobxStore.appStore.location && mobxStore.appStore.location.action === 'POP' && !server;
  if (isPop) {
    if (await mobxStore.screen.userStore.hasCache(username)) {
      await mobxStore.screen.userStore.getCache(username);
    } else {
      await mobxStore.screen.userStore.getInit(...arg);
    }
  } else {
    await mobxStore.screen.userStore.getInit(...arg);
  }
  switch (type!) {
    case UserType.collections:
      if (isPop && mobxStore.screen.userCollectionStore.isCache(username!)) {
        mobxStore.screen.userCollectionStore.getCache(username);
      } else {
        all.push(
          mobxStore.screen.userCollectionStore.getList(
            username!,
            req ? req.headers : undefined,
          ),
        );
      }
      break;
    default:
      if (isPop && mobxStore.screen.userPictureStore.isCache(username, type)) {
        mobxStore.screen.userPictureStore.getCache(username, type);
      } else {
        all.push(mobxStore.screen.userPictureStore.getList(...arg));
      }
  }
  await Promise.all(all);
  return {
    error,
    type,
    username: params.username,
  };
};

export default withRouter(withError<IProps>(User));
