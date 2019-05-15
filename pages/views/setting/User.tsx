import * as React from 'react';
import { Cell, Grid } from 'styled-css-grid';

import { connect } from '@pages/common/utils/store';
import { Avatar } from '@pages/components';
import { Button } from '@pages/components/Button';
import { Input } from '@pages/components/Input';
import { AccountStore } from '@pages/stores/AccountStore';

interface IUserProps {
  accountStore?: AccountStore;
}

const User: React.SFC<IUserProps> = ({ accountStore }) => {
  const { userInfo } = accountStore!;
  return (
    <Grid columns="1lf" rowGap="24px">
      <Cell>
        <Grid columns="96px auto" gap="24px">
          <Cell width={1} center>
            <Avatar size={96} src={userInfo!.avatar} />
          </Cell>
          <Cell width={1} middle>
            <div>
              <Button>上传头像</Button>
            </div>
          </Cell>
        </Grid>
      </Cell>
      <Cell>
        <Grid gap="24px" columns={2}>
          <Cell width={1} center>
            <Input label="昵称（显示的名称）" value={userInfo!.name || userInfo!.username} />
          </Cell>
          <Cell width={1} middle>
            <Input label="用户名（登录名）" disabled value={userInfo!.username} />
          </Cell>
        </Grid>
      </Cell>
      <Cell>
        <Grid columns="auto" justifyContent="right">
          <Cell>
            <Button>上传头像</Button>
          </Cell>
        </Grid>
      </Cell>
    </Grid>
  );
};

export default connect('accountStore')(User);
