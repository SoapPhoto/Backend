import React from 'react';
import { Cell, Grid } from 'styled-css-grid';

import { getTitle } from '@lib/common/utils';
import { getImageUrl } from '@lib/common/utils/image';
import { connect } from '@lib/common/utils/store';
import { Avatar } from '@lib/components';
import { Button } from '@lib/components/Button';
import { Input } from '@lib/components/Input';
import Toast from '@lib/components/Toast';
import { Upload } from '@lib/components/Upload';
import { AccountStore } from '@lib/stores/AccountStore';
import Head from 'next/Head';

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

  const [avatarUrl, setAvatarUrl] = React.useState(userInfo!.avatar);
  const avatarFile = React.useRef<File>();

  const handleOk = async () => {
    setBtnLoading(true);
    try {
      await updateProfile(data, avatarFile.current);
      Toast.success('修改成功');
    } finally {
      setBtnLoading(false);
    }
  };
  const handleAvatarChange = (files: FileList | null) => {
    if (files) {
      [avatarFile.current] = (files as any) as File[];
      const url = getImageUrl(files[0]);
      setAvatarUrl(url);
    }
  };
  return (
    <Grid columns="1lf" rowGap="24px">
      <Head>
        <title>{getTitle('用户设置')}</title>
      </Head>
      <Cell>
        <Grid columns="96px auto" gap="24px">
          <Cell width={1} center>
            <Avatar size={96} src={avatarUrl} />
          </Cell>
          <Cell width={1} middle>
            <div>
              <Upload onFileChange={handleAvatarChange}>
                <Button>上传头像</Button>
              </Upload>
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
