import { inject, observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';

import { CustomNextContext } from '@pages/common/interfaces/global';
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
`;

const UserName = styled.h2`
  font-family: Rubik;
  font-size: 2em;
  margin-top: 18px;
`;

const Profile = styled.div`
  display: flex;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  margin-right: 24px;
  min-width: 0;
  font-family: Rubik;
`;

@inject((stores: IMyMobxStore) => ({
  userStore: stores.screen.userStore,
}))
@observer
class User extends React.Component<IProps> {
  public static getInitialProps: (_: CustomNextContext) => any;
  public render() {
    const { user, pictureList } = this.props.userStore;
    return (
      <Wrapper>
        <UserHeader>
          <Grid columns="140px auto" gap="32px">
            <Cell>
              <Avatar src={user.avatar} size={140} />
            </Cell>
            <Cell>
              <UserName>{user.name || user.username}</UserName>
              <Profile>
                <ProfileItem><Link size={16}/>{user.website}</ProfileItem>
                <ProfileItem>{user.bio}</ProfileItem>
              </Profile>
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
