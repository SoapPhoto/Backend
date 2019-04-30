import * as React from 'react';

import { request } from '@pages/common/utils/request';
import { AccountStore } from '@pages/stores/AccountStore';
import { inject, observer } from 'mobx-react';

interface IProps {
  accountStore: AccountStore;
}

export default inject('accountStore')(
  observer(
    React.memo<IProps>(
      ({ accountStore }) => {
        const { login } = accountStore;
        const [username, setUsername] = React.useState('');
        const [password, setPassword] = React.useState('');
        const handleOk = () => {
          login(username, password);
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
);
