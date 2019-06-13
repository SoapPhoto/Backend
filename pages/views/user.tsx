import { inject, observer } from 'mobx-react';
import Head from 'next/Head';
import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';
import parse from 'url-parse';

import { CustomNextContext, IBaseScreenProps } from '@pages/common/interfaces/global';
import { href } from '@pages/common/utils/themes/common';
import { Avatar, Nav, NavItem } from '@pages/components';
import { PictureList } from '@pages/containers/Picture/List';
import { Link as LinkIcon } from '@pages/icon';
import { IMyMobxStore } from '@pages/stores/init';
import { UserScreenStore } from '@pages/stores/screen/User';
import { computed } from 'mobx';
import { Cell, Grid } from 'styled-css-grid';
import Error from '../_error';

interface IProps extends IBaseScreenProps {
  username: string;
  userStore: UserScreenStore;
}

const Wrapper = styled.div``;

const UserHeader = styled.div`
  max-width: ${rem('700px')};
  width: 100%;
  margin: 64px auto;
  padding: 0 ${rem('20px')};
`;

const UserName = styled.h2`
  font-family: Rubik;
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  margin-top: ${rem('6px')};
  margin-bottom: ${rem('12px')};
`;

const Profile = styled.div`
  display: flex;
  margin-bottom: ${rem('4px')};
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: ${rem('8px')};
  margin-right: ${rem('24px')};
  min-width: 0;
  font-family: Rubik;
  color: ${_ => _.theme.colors.secondary};
  & svg {
    margin-right: ${rem('4px')};
  }
`;

const ProfileItemLink = styled.a`
  display: flex;
  align-items: center;
  ${_ => href(_.theme.colors.secondary)}
`;

const Bio = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[1])};
  font-family: Rubik;
`;

@inject((stores: IMyMobxStore) => ({
  userStore: stores.screen.userStore,
}))
@observer
class User extends React.Component<IProps> {
  get name () {
    const { user } = this.props.userStore;
    return user.name || user.username;
  }

  @computed get type () {
    return this.props.userStore.type;
  }

  public static getInitialProps: (_: CustomNextContext) => any;

  constructor(props: IProps) {
    super(props);
    props.userStore.initData();
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
    const { user, likeInfo, type, pictureInfo } = this.props.userStore;
    if (this.props.error) {
      return <Error status={this.props.error.statusCode} />;
    }
    let info: typeof likeInfo | typeof pictureInfo;
    if (type === 'like') {
      info = likeInfo!;
    } else {
      info = pictureInfo!;
    }
    console.log(likeInfo, pictureInfo);
    return (
      <Wrapper>
        <Head>
          <title>{`${this.name} (@${user.username}) - 肥皂`}</title>
        </Head>
        <UserHeader>
          <Grid columns="140px auto" gap="32px">
            <Cell>
              <Avatar src={user.avatar} size={140} />
            </Cell>
            <Cell>
              <UserName>{this.name}</UserName>
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
          noMore={info.isNoMore}
          data={info.list}
          like={info.like}
          onPage={info.getPageList}
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

export default User;
