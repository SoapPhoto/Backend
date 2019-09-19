import { Formik, FormikActions } from 'formik';
import Head from 'next/head';
import React, { useCallback, useEffect } from 'react';
import { Emojione } from 'react-emoji-render';

import { LoginSchema } from '@lib/common/dto/auth';
import { getTitle } from '@lib/common/utils';
import { Button } from '@lib/components/Button';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { withAuth } from '@lib/components/router/withAuth';
import Toast from '@lib/components/Toast';
import { Router } from '@lib/routes';
import { Title, Wrapper, OauthIcon } from '@lib/styles/views/auth';
import rem from 'polished/lib/helpers/rem';
import styled from 'styled-components';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore } from '@lib/stores/hooks';
import { useRouter } from '@lib/router';
import { withError } from '@lib/components/withError';
import { IBaseScreenProps } from '@lib/common/interfaces/global';
import { GitHub, GoogleFill } from '@lib/icon';
import {
  oauthOpen, getOauthUrl, oauthSuccess, IOauthSuccessData,
} from '@lib/common/utils/oauth';
import { OauthType } from '@common/enum/router';
import { OauthStateType } from '@common/enum/oauthState';

interface IValues {
  username: string;
  password: string;
}

const Handle = styled.div`
  margin-top: ${rem(24)};
  width: 100%;
  display: grid;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fill, ${rem(32)});
`;

const Login: React.FC<IBaseScreenProps> = () => {
  const { query } = useRouter();
  const { login, codeLogin } = useAccountStore();
  const { t } = useTranslation();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const handleOk = async (value: IValues, { setSubmitting }: FormikActions<IValues>) => {
    setConfirmLoading(true);
    setSubmitting(false);
    try {
      await login(value.username, value.password);
      setSubmitting(true);
      setTimeout(() => {
        if (query.redirectUrl) {
          Router.replaceRoute(query.redirectUrl);
        } else {
          Router.replaceRoute('/');
        }
      }, 400);
      Toast.success(t('login_successful'));
    } catch (error) {
      setSubmitting(false);
      Toast.error(t(error.message));
    } finally {
      setConfirmLoading(false);
    }
  };
  const getInfo = useCallback(async (data: IOauthSuccessData) => {
    try {
      await codeLogin(data.code!, data.type!);
      setTimeout(() => {
        if (query.redirectUrl) {
          Router.replaceRoute(query.redirectUrl);
        } else {
          Router.replaceRoute('/');
        }
      }, 400);
      Toast.success(t('login_successful'));
    } catch (error) {
      Toast.error(t(error.message));
    } finally {
      setConfirmLoading(false);
    }
  }, [codeLogin, query.redirectUrl, t]);
  const messageCb = useCallback((e: MessageEvent) => {
    oauthSuccess(e, getInfo);
    window.removeEventListener('message', messageCb);
  }, [getInfo]);
  const oauth = useCallback((type: OauthType) => {
    oauthOpen(getOauthUrl(type, OauthStateType.login));
    window.addEventListener('message', messageCb);
    return () => window.removeEventListener('message', messageCb);
  }, [messageCb]);
  useEffect(() => () => window.removeEventListener('message', messageCb), [messageCb]);
  return (
    <Wrapper>
      <Head>
        <title>{getTitle('login', t)}</title>
      </Head>
      <Title>
        <Emojione
          svg
          text={t('login')}
        />
      </Title>
      <Formik<IValues>
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={handleOk}
        validationSchema={LoginSchema(t)}
      >
        {({
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <FieldInput
              name="username"
              label={t('username')}
            />
            <FieldInput
              type="password"
              name="password"
              label={t('password')}
              style={{ marginTop: rem(24) }}
            />
            <Handle>
              <OauthIcon
                type="button"
                onClick={() => oauth(OauthType.GITHUB)}
              >
                <GitHub size={18} />
              </OauthIcon>
              <OauthIcon
                type="button"
                onClick={() => oauth(OauthType.GOOGLE)}
              >
                <GoogleFill size={18} />
              </OauthIcon>
            </Handle>
            <Button
              loading={confirmLoading}
              style={{ marginTop: rem(42), width: '100%' }}
              type="submit"
              disabled={isSubmitting}
            >
              {t('login_btn')}
            </Button>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withAuth('guest')(
  withError(pageWithTranslation(I18nNamespace.Auth)(Login)),
);
