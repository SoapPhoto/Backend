import { Formik, FormikActions } from 'formik';
import Head from 'next/head';
import React, { useCallback, useEffect } from 'react';
import { Emojione } from 'react-emoji-render';
import qs from 'querystring';

import { LoginSchema } from '@lib/common/dto/auth';
import { getTitle } from '@lib/common/utils';
import { Button } from '@lib/components/Button';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { withAuth } from '@lib/components/router/withAuth';
import Toast from '@lib/components/Toast';
import { Router } from '@lib/routes';
import { Title, Wrapper, OauthIcon } from '@lib/styles/views/auth';
import rem from 'polished/lib/helpers/rem';
import { css } from 'styled-components';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore } from '@lib/stores/hooks';
import { useRouter } from '@lib/router';
import { withError } from '@lib/components/withError';
import { IBaseScreenProps } from '@lib/common/interfaces/global';
import { GitHub } from '@lib/icon';
import { oauthOpen } from '@lib/common/utils/oauth';
import { OauthType } from '@common/enum/router';
import { OauthStateType } from '@common/enum/oauthState';

interface IValues {
  username: string;
  password: string;
}

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
  const getInfo = useCallback(async (data: {code: string}) => {
    try {
      await codeLogin(data.code, OauthType.GITHUB);
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
    if (e.origin === window.location.origin) {
      if (e.data.fromOauthWindow) {
        getInfo(qs.parse(e.data.fromOauthWindow.substr(1)) as any);
        window.postMessage({ fromParent: true }, window.location.href);
      }
    }
  }, [getInfo]);
  const githubOauth = useCallback(() => {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    const cb = `${process.env.URL}/oauth/github/redirect`;
    const github = 'https://github.com/login/oauth/authorize';
    const url = `${github}?client_id=${clientId}&state=${OauthStateType.login}&redirect_uri=${cb}`;

    oauthOpen(url);
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
              css={css`
                  margin-top: ${rem(24)};
                `}
            />
            <div
              css={css`
                margin-top: ${rem(24)};
                width: 100%;
              `}
            >
              <OauthIcon
                type="button"
                onClick={githubOauth}
              >
                <GitHub size={18} />
              </OauthIcon>
            </div>
            <Button
              loading={confirmLoading}
              css={css`
                  margin-top: ${rem(42)};
                  width: 100%;
                `}
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
