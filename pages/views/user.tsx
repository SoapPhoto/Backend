import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';
import { Avatar } from '@pages/components';
import { PictureList } from '@pages/containers/Picture/List';
import { IMyMobxStore, store } from '@pages/stores/init';
import { UserScreenStore } from '@pages/stores/UserScreenStore';

interface IProps {
  username: string;
  userStore: UserScreenStore;
}

const Wrapper = styled.div``;

const UserHeader = styled.div``;

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
          Col
          <Avatar src={user.avatar} size={128} />
          {user.username}
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
