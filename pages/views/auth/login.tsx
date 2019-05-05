import * as React from 'react';

import { parsePath } from '@pages/common/utils';
import { withAuth } from '@pages/components/router/withAuth';
import { Router } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import { inject, observer } from 'mobx-react';
import { RouterProps, withRouter } from 'next/router';

interface IProps {
  accountStore: AccountStore;
  router: RouterProps<any>;
}

export default inject('accountStore')(
  observer(
    withAuth(
      withRouter(
        React.memo<IProps>(
          ({ accountStore, router }) => {
            const { query } = parsePath(router.asPath!);
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
              <div>
                <h2>登录</h2>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <input
                  type="text"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button onClick={handleOk}>登录</button>
              </div>
            );
          },
        ),
      ),
    ),
  ),
);
