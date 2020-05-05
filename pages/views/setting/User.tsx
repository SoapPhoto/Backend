import React, { useState, useRef } from 'react';
import { Cell, Grid } from 'styled-css-grid';
import Head from 'next/head';
import { useApolloClient } from 'react-apollo';
import { Formik, FormikHelpers } from 'formik';
import { isNotEmpty, isURL } from 'class-validator';

import { getTitle } from '@lib/common/utils';
import { getImageUrl } from '@lib/common/utils/image';
import { Avatar } from '@lib/components';
import { Button } from '@lib/components/Button';
import { Input } from '@lib/components/Input';
import Toast from '@lib/components/Toast';
import { Upload } from '@lib/components/Upload';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore } from '@lib/stores/hooks';
import { uploadQiniu } from '@lib/services/file';
import { UpdateProfile } from '@lib/schemas/mutations';

import { UploadType } from '@common/enum/upload';
import { UserEntity } from '@lib/common/interfaces/user';
import { FieldInput } from '@lib/components/Formik';

interface IValues {
  name: string;
  website: string;
  bio: string;
}

const User: React.FC = () => {
  const client = useApolloClient();
  const { userInfo, setUserInfo } = useAccountStore();
  const { t } = useTranslation();

  const [btnLoading, setBtnLoading] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(userInfo!.avatar);
  const avatarFile = useRef<File>();

  const handleOk = (value: IValues, { setSubmitting }: FormikHelpers<IValues>) => {
    (async () => {
      setBtnLoading(true);
      let key = '';
      if (avatarFile.current) {
        key = await uploadQiniu(avatarFile.current, UploadType.AVATAR);
      }
      try {
        const response = await client.mutate<{updateProfile: UserEntity}>({
          mutation: UpdateProfile,
          variables: {
            data: {
              ...value,
              key,
            },
          },
        });
        if (response.data) {
          setUserInfo({
            ...userInfo!,
            ...response.data.updateProfile,
          } as UserEntity);
        }
        Toast.success(t('message.success_modify'));
      } finally {
        setBtnLoading(false);
        setSubmitting(false);
      }
    })();
  };
  const handleAvatarChange = (files: FileList | null) => {
    if (files) {
      [avatarFile.current] = (files as any) as File[];
      const url = getImageUrl(files[0]);
      setAvatarUrl(url);
    }
  };
  return (
    <>
      <Head>
        <title>{getTitle('title.setting', t)}</title>
      </Head>
      <Formik<IValues>
        initialValues={{
          name: userInfo!.name || '',
          website: userInfo!.website || '',
          bio: userInfo!.bio || '',
        }}
        onSubmit={handleOk}
        validate={(value) => {
          if (isNotEmpty(value.website) && !isURL(value.website)) {
            return {
              website: t('validation.yup_format', t('label.url')),
            };
          }
          return {};
        }}
      >
        {({
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid columns="1lf" rowGap="24px">
              <Cell>
                <Grid columns="96px auto" gap="24px">
                  <Cell width={1} center>
                    <Avatar size={96} src={avatarUrl} />
                  </Cell>
                  <Cell width={1} middle>
                    <div>
                      <Upload onFileChange={handleAvatarChange}>
                        <Button type="button">{t('setting.upload_avatar')}</Button>
                      </Upload>
                    </div>
                  </Cell>
                </Grid>
              </Cell>
              <Cell>
                <Grid gap="24px" columns={2}>
                  <Cell width={1} middle>
                    <Input label={t('setting.label.username')} disabled defaultValue={userInfo!.username} />
                  </Cell>
                  <Cell width={1} center>
                    <FieldInput
                      name="name"
                      label={t('setting.label.name')}
                    />
                  </Cell>
                </Grid>
              </Cell>
              <Cell>
                <Grid columns={1} gap="24px">
                  <FieldInput
                    name="website"
                    label={t('setting.label.website')}
                    placeholder="https://"
                  />
                </Grid>
              </Cell>
              <Cell>
                <Grid columns={1} gap="24px">
                  <FieldInput
                    name="bio"
                    label={t('setting.label.bio')}
                  />
                </Grid>
              </Cell>
              <Cell>
                <Grid columns="auto" justifyContent="right">
                  <Cell>
                    <Button
                      loading={btnLoading}
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {t('setting.update')}
                    </Button>
                  </Cell>
                </Grid>
              </Cell>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default User;
