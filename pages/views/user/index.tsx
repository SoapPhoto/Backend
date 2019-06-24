import { inject, observer } from 'mobx-react';
import Head from 'next/Head';
import React from 'react';
import parse from 'url-parse';

import { CustomNextContext, CustomNextPage, IBaseScreenProps } from '@pages/common/interfaces/global';
import { getTitle } from '@pages/common/utils';
import { Avatar, Nav, NavItem } from '@pages/components';
import { withError } from '@pages/components/withError';
import { PictureList } from '@pages/containers/Picture/List';
import { Link as LinkIcon } from '@pages/icon';
import { Link } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import { IMyMobxStore } from '@pages/stores/init';
import { UserScreenStore } from '@pages/stores/screen/User';
import { computed } from 'mobx';
import { Cell, Grid } from 'styled-css-grid';
import { Bio, EditIcon, Profile, ProfileItem, ProfileItemLink, UserHeader, UserName, Wrapper } from './styles';

interface IProps extends IBaseScreenProps {
  username: string;
  userStore: UserScreenStore;
  accountStore: AccountStore;
}

@inject((stores: IMyMobxStore) => ({
  userStore: stores.screen.userStore,
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

  @computed get data() {
    const { likeInfo, type, pictureInfo } = this.props.userStore;
    let info: typeof likeInfo | typeof pictureInfo;
    if (type === 'like') {
      info = likeInfo!;
    } else {
      info = pictureInfo!;
    }
    return info;
  }

  public static getInitialProps: (_: CustomNextContext) => any;

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
          noMore={this.data.isNoMore}
          data={this.data.list}
          like={this.data.like}
          onPage={this.data.getPageList}
        />
      </Wrapper>
    );
  }
}

User.getInitialProps = async ({ mobxStore, req, route }: CustomNextContext) => {
  const { params } = route;
  if (
    mobxStore.appStore.location &&
    mobxStore.appStore.location.action === 'POP' &&
    mobxStore.screen.userStore.init &&
    mobxStore.screen.userStore.user &&
    mobxStore.screen.userStore.user.username === params.username &&
    mobxStore.screen.userStore.type === params.type
  ) {
    return {};
  }
  let error: {
    message: string,
    statusCode: number,
  } | undefined;
  try {
    await mobxStore.screen.userStore.getInit(params.username!, params.type!, req ? req.headers : undefined);
  } catch (err) {
    error = err;
  }
  return {
    error,
    username: params.username,
  };
};

export default withError<IProps>(User);
