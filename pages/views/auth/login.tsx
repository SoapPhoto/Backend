import { request } from '@pages/common/utils/request';
import * as React from 'react';

export default () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const login = () => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');
    request.post('oauth/token', params, {
      headers: {
        Authorization: 'Basic MTdjZWE1MjItYzNjMS00M2IxLWE4MjMtNmNmMjg2Y2I1ZTE0OnRlc3Q',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
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
      <button onClick={login}>登录</button>
    </div>
  );
};
