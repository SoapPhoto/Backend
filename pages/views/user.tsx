import { inject, observer } from 'mobx-react';
import Head from 'next/Head';
import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';
import parse from 'url-parse';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { href } from '@pages/common/utils/themes/common';
import { Avatar, Nav, NavItem } from '@pages/components';
import { PictureList } from '@pages/containers/Picture/List';
import { Link as LinkIcon } from '@pages/icon';
import { Link } from '@pages/routes';
import { IMyMobxStore } from '@pages/stores/init';
import { UserScreenStore } from '@pages/stores/screen/User';
import { computed } from 'mobx';
import { Cell, Grid } from 'styled-css-grid';

interface IProps {
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
  public static getInitialProps: (_: CustomNextContext) => any;
  @computed get type () {
    return this.props.userStore.type;
  }
  public parseWebsite = (url: string) => {
    const data = parse(url);
    return data.hostname;
  }
  public render() {
    const { user, like, list, likeList, isNoMore, type } = this.props.userStore;
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
        <PictureList noMore={isNoMore} data={type === 'like' ? likeList : list} like={like} />
      </Wrapper>
    );
  }
}

User.getInitialProps = async (_: CustomNextContext) => {
  const { params } = _.route;
  if (
    _.mobxStore.appStore.location &&
    _.mobxStore.appStore.location.action === 'POP' &&
    _.mobxStore.screen.userStore.init &&
    _.mobxStore.screen.userStore.user &&
    _.mobxStore.screen.userStore.user.username === params.username &&
    _.mobxStore.screen.userStore.type === params.type
  ) {
    return {};
  }
  await _.mobxStore.screen.userStore.getInit(params.username!, params.type!, _.req ? _.req.headers : undefined);
  return {
    username: params.username,
  };
};

export default User;
