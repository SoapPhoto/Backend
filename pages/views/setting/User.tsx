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

const User: React.FC<IUserProps> = ({ accountStore }) => {
  const { userInfo, updateProfile } = accountStore!;
  const [data, setData] = React.useState({
    name: userInfo!.name || userInfo!.username,
    website: userInfo!.website,
    bio: userInfo!.bio,
  });
  const [btnLoading, setBtnLoading] = React.useState(false);
  const handleOk = async () => {
    setBtnLoading(true);
    try {
      await updateProfile(data);
    } finally {
      setBtnLoading(false);
    }
  };
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
          <Cell width={1} middle>
            <Input label="用户名（登录名）" disabled defaultValue={userInfo!.username} />
          </Cell>
          <Cell width={1} center>
            <Input
              label="昵称（显示的名称）"
              value={data.name}
              onChange={e => setData({ ...data, name: e.target.value })}
            />
          </Cell>
        </Grid>
      </Cell>
      <Cell>
        <Grid columns={1} gap="24px">
          <Input
            label="个人网站"
            placeholder="https://"
            value={data.website}
            onChange={e => setData({ ...data, website: e.target.value })}
          />
        </Grid>
      </Cell>
      <Cell>
        <Grid columns={1} gap="24px">
          <Input
            label="简介"
            value={data.bio}
            onChange={e => setData({ ...data, bio: e.target.value })}
          />
        </Grid>
      </Cell>
      <Cell>
        <Grid columns="auto" justifyContent="right">
          <Cell>
            <Button loading={btnLoading} onClick={handleOk}>更新设置</Button>
          </Cell>
        </Grid>
      </Cell>
    </Grid>
  );
};

export default connect('accountStore')(User);
