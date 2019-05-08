import * as React from 'react';

import { parsePath } from '@pages/common/utils';
import { Button } from '@pages/components/Button';
import { Input } from '@pages/components/Input';
import { withAuth } from '@pages/components/router/withAuth';
import { Router } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import { inject, observer } from 'mobx-react';
import { withRouter, WithRouterProps } from 'next/router';
import { Title, Wrapper } from './styles';

interface IProps extends WithRouterProps {
  accountStore: AccountStore;
}

const Login: React.SFC<IProps> = ({ accountStore, router }) => {
  const { query } = parsePath(router!.asPath!);
  const { login } = accountStore;
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleOk = async () => {
    await login(username, password);
    if (query.redirectUrl) {
      Router.replaceRoute(query.redirectUrl);
    } else {
      Router.replaceRoute('/');
    }
  };
  return (
    <Wrapper>
      <Title>登录</Title>
      <Input
        type="text"
        placeholder="用户名"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <Input
        type="password"
        value={password}
        placeholder="密码"
        style={{ marginTop: '18px' }}
        onChange={e => setPassword(e.target.value)}
      />
      <Button style={{ marginTop: '24px' }} onClick={handleOk}>登录</Button>
    </Wrapper>
  );
};

export default inject('accountStore')(
  observer(
    withAuth('guest')(
      withRouter(
        Login,
      ),
    ),
  ),
);
