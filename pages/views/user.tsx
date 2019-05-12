import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { UserEntity } from '@pages/common/interfaces/user';
import { request } from '@pages/common/utils/request';

interface IProps {
  username: string;
  screenData: UserEntity;
}

@observer
export default class User extends React.Component<IProps> {
  @computed get userData() {
    return this.props.screenData;
  }

  public static async getInitialProps(ctx: CustomNextContext) {
    const { params } = ctx.route;
    const { data } = await request.get<UserEntity>(`/api/user/${params.username}`);
    return {
      username: params.username,
      screenData: data,
    };
  }
  public render() {
    return (
      <div>{this.userData.username}</div>
    );
  }
}
