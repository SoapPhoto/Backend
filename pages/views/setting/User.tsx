import React, { useState, useRef, useCallback } from 'react';
import { Cell, Grid } from 'styled-css-grid';

import { getTitle } from '@lib/common/utils';
import { getImageUrl } from '@lib/common/utils/image';
import { Avatar } from '@lib/components';
import { Button } from '@lib/components/Button';
import { Input } from '@lib/components/Input';
import Toast from '@lib/components/Toast';
import { Upload } from '@lib/components/Upload';
import Head from 'next/head';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore } from '@lib/stores/hooks';
import { uploadQiniu } from '@lib/services/file';
import { UploadType } from '@common/enum/upload';

const User: React.FC = () => {
  const { userInfo, updateProfile } = useAccountStore();
  const { t } = useTranslation();

  const [data, setData] = useState({
    name: userInfo!.fullName,
    website: userInfo!.website,
    bio: userInfo!.bio,
  });
  const [btnLoading, setBtnLoading] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(userInfo!.avatar);
  const avatarFile = useRef<File>();

  const handleOk = async () => {
    setBtnLoading(true);
    let key = '';
    if (avatarFile.current) {
      key = await uploadQiniu(avatarFile.current, UploadType.PICTURE);
    }
    try {
      await updateProfile({
        ...data,
        key,
      });
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
        <title>{getTitle('setting', t)}</title>
      </Head>
      <Cell>
        <Grid columns="96px auto" gap="24px">
          <Cell width={1} center>
            <Avatar size={96} src={avatarUrl} />
          </Cell>
          <Cell width={1} middle>
            <div>
              <Upload onFileChange={handleAvatarChange}>
                <Button>{t('setting_upload_avatar')}</Button>
              </Upload>
            </div>
          </Cell>
        </Grid>
      </Cell>
      <Cell>
        <Grid gap="24px" columns={2}>
          <Cell width={1} middle>
            <Input label={t('setting_label.username')} disabled defaultValue={userInfo!.username} />
          </Cell>
          <Cell width={1} center>
            <Input
              label={t('setting_label.name')}
              value={data.name}
              onChange={e => setData({ ...data, name: e.target.value })}
            />
          </Cell>
        </Grid>
      </Cell>
      <Cell>
        <Grid columns={1} gap="24px">
          <Input
            label={t('setting_label.website')}
            placeholder="https://"
            value={data.website}
            onChange={e => setData({ ...data, website: e.target.value })}
          />
        </Grid>
      </Cell>
      <Cell>
        <Grid columns={1} gap="24px">
          <Input
            label={t('setting_label.bio')}
            value={data.bio}
            onChange={e => setData({ ...data, bio: e.target.value })}
          />
        </Grid>
      </Cell>
      <Cell>
        <Grid columns="auto" justifyContent="right">
          <Cell>
            <Button loading={btnLoading} onClick={handleOk}>{t('setting_update')}</Button>
          </Cell>
        </Grid>
      </Cell>
    </Grid>
  );
};

export default User;
