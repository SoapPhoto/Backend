import { inject, observer } from 'mobx-react';
import { NextContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';

import { request } from '@pages/common/utils/request';
import { BodyLayout } from '@pages/containers/BodyLayout';
import { Header } from '@pages/containers/Header';
import { AccountStore } from '@pages/stores/AccountStore';
import { Link } from '../components/router';

interface InitialProps extends NextContext {
  screenData: any;
}

interface IProps extends InitialProps {
  accountStore: AccountStore;
}

const Title = styled.h1`
  color: red;
  font-size: 20px;
`;
@inject('accountStore')
@observer
export default class Index extends React.Component<IProps> {
  public static async getInitialProps(_: NextContext<any>) {
    const { data } = await request.get('/api/picture');
    return {
      data,
    };
  }
  public render() {
    const { accountStore } = this.props;
    return (
      <BodyLayout>
        <Header />
        {
          accountStore.isLogin &&
          <div>Hello {accountStore.userInfo.username}</div>
        }
        <Link to="test"><a>About</a></Link>
      </BodyLayout>
    );
  }
}
