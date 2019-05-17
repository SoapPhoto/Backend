import { inject, observer } from 'mobx-react';
import Head from 'next/Head';
import React from 'react';
import styled from 'styled-components';
import parse from 'url-parse';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { href } from '@pages/common/utils/themes/common';
import { Avatar } from '@pages/components';
import { PictureList } from '@pages/containers/Picture/List';
import { Link } from '@pages/icon';
import { IMyMobxStore } from '@pages/stores/init';
import { UserScreenStore } from '@pages/stores/screen/User';
import { Cell, Grid } from 'styled-css-grid';

interface IProps {
  username: string;
  userStore: UserScreenStore;
}

const Wrapper = styled.div``;

const UserHeader = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 64px auto;
  padding: 0 20px;
`;

const UserName = styled.h2`
  font-family: Rubik;
  font-size: 2em;
  margin-top: 6px;
  margin-bottom: 12px;
`;

const Profile = styled.div`
  display: flex;
  margin-bottom: 4px;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  margin-right: 24px;
  min-width: 0;
  font-family: Rubik;
  color: ${_ => _.theme.colors.secondary};
  & svg {
    margin-right: 4px;
  }
`;

const ProfileItemLink = styled.a`
  display: flex;
  align-items: center;
  ${_ => href(_.theme.colors.secondary)}
`;

const Bio = styled.p`
  font-size: 14px;
  font-family: Rubik;
`;

@inject((stores: IMyMobxStore) => ({
  userStore: stores.screen.userStore,
}))
@observer
class User extends React.Component<IProps> {
  public static getInitialProps: (_: CustomNextContext) => any;
  get name () {
    const { user } = this.props.userStore;
    return user.name || user.username;
  }
  public parseWebsite = (url: string) => {
    const data = parse(url);
    return data.hostname;
  }
  public render() {
    const { user, pictureList } = this.props.userStore;
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
                      <Link size={14}/>{this.parseWebsite(user.website)}
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
        <PictureList data={pictureList} />
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
    _.mobxStore.screen.userStore.user.username === params.username
  ) {
    return {};
  }
  await _.mobxStore.screen.userStore.getDetail(params.username!);
  return {
    username: params.username,
  };
};

export default User;
