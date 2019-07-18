import { inject, observer } from 'mobx-react';
import Head from 'next/Head';
import React from 'react';
import parse from 'url-parse';

import { CustomNextContext, IBaseScreenProps } from '@lib/common/interfaces/global';
import { getTitle } from '@lib/common/utils';
import { Avatar, Nav, NavItem } from '@lib/components';
import { withError } from '@lib/components/withError';
import { PictureList } from '@lib/containers/Picture/List';
import { Link as LinkIcon } from '@lib/icon';
import { Link } from '@lib/routes';
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
} from '@lib/styles/views/user';
import { computed } from 'mobx';
import { WithRouterProps } from 'next/dist/client/with-router';
import { withRouter } from 'next/router';
import { Cell, Grid } from 'styled-css-grid';

interface IProps extends IBaseScreenProps, WithRouterProps {
  username: string;
  userStore: UserScreenStore;
  listStore: UserScreenPictureList;
  accountStore: AccountStore;
}

@inject((stores: IMyMobxStore) => ({
  userStore: stores.screen.userStore,
  listStore: stores.screen.userPictureStore,
  accountStore: stores.accountStore,
}))
@observer
class User extends React.Component<IProps> {
  get name () {
    const { user } = this.props.userStore;
    return user.name || user.username;
  }

  @computed get type() {
    return this.props.userStore.type;
  }

  public static getInitialProps: (_: CustomNextContext) => any;

  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.userStore.active();
  }

  public componentWillUnmount() {
    this.props.userStore.deactive();
  }

  public parseWebsite = (url: string) => {
    const data = parse(url);
    return data.hostname;
  }

  public render() {
    const { isLogin, userInfo } = this.props.accountStore;
    const { user } = this.props.userStore;
    const { list, isNoMore, getPageList, like } = this.props.listStore;
    return (
      <Wrapper>
        <Head>
          <title>{getTitle(`${this.name} (@${user.username})`)}</title>
        </Head>
        <UserHeader>
          <Grid columns="140px auto" gap="32px">
            <Cell>
              <Avatar src={user.avatar} size={140} />
            </Cell>
            <Cell>
              <UserName>
                {this.name}
                {
                  isLogin && userInfo && userInfo.username === user.username &&
                  <Link route="/setting/profile">
                    <a href="'/setting/profile">
                      <EditIcon size={18} />
                    </a>
                  </Link>
                }
              </UserName>
              <Profile>
                {
                  user.website &&
                  <ProfileItem>
                    <ProfileItemLink href={user.website} target="__blank">
                      <LinkIcon size={14}/>{this.parseWebsite(user.website)}
                    </ProfileItemLink>
                  </ProfileItem>
                }
              </Profile>
              <Bio>
                {user.bio}
              </Bio>
            </Cell>
          </Grid>
        </UserHeader>
        <Nav>
          <NavItem route={`/@${user.username}`}>
            照片
          </NavItem>
          <NavItem route={`/@${user.username}/like`}>
            喜欢
          </NavItem>
        </Nav>
        <PictureList
          noMore={isNoMore}
          data={list}
          like={like}
          onPage={getPageList}
        />
      </Wrapper>
    );
  }
}

User.getInitialProps = async ({ mobxStore, req, route }: CustomNextContext) => {
  const { params } = route;
  let error: {
    message: string,
    statusCode: number,
  } | undefined;
  try {
    const all = [];
    const arg: [string, string, any] = [params.username!, params.type!, req ? req.headers : undefined];
    const isUsername = (
      mobxStore.screen.userStore.init &&
      mobxStore.screen.userStore.user &&
      mobxStore.screen.userStore.user.username === params.username
    );
    const isPop = mobxStore.appStore.location && mobxStore.appStore.location.action === 'POP';
    if (!(isPop && isUsername)) {
      all.push(mobxStore.screen.userStore.getInit(...arg));
    }
    if (isPop && isUsername && mobxStore.screen.userPictureStore.isCache(params.type)) {
      mobxStore.screen.userPictureStore.getCache(params.type);
    } else {
      all.push(mobxStore.screen.userPictureStore.getList(...arg));
    }
    await Promise.all(all);
  } catch (err) {
    error = err;
  }
  return {
    error,
    username: params.username,
  };
};

export default withRouter(withError<IProps>(User));
