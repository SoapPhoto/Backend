import { Formik, FormikActions } from 'formik';
import { WithRouterProps } from 'next/dist/client/with-router';
import Head from 'next/head';
import { withRouter } from 'next/router';
import React from 'react';
import { Emojione } from 'react-emoji-render';

import { LoginSchema } from '@lib/common/dto/auth';
import { getTitle, parsePath } from '@lib/common/utils';
import { connect } from '@lib/common/utils/store';
import { Button } from '@lib/components/Button';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { withAuth } from '@lib/components/router/withAuth';
import Toast from '@lib/components/Toast';
import { Router } from '@lib/routes';
import { AccountStore } from '@lib/stores/AccountStore';
import { Title, Wrapper } from '@lib/styles/views/auth';
import rem from 'polished/lib/helpers/rem';
import { css } from 'styled-components';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { useTranslation } from '@lib/i18n/useTranslation';

interface IProps extends WithRouterProps {
  accountStore: AccountStore;
}

interface IValues {
  username: string;
  password: string;
}

const Login = withRouter<IProps>(
  ({ accountStore, router }) => {
    const { query } = parsePath(router!.asPath!);
    const { login } = accountStore;
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
        Toast.success('登录成功！');
      } catch (error) {
        setSubmitting(false);
        // Toast.error('登录失败');
      } finally {
        setConfirmLoading(false);
      }
    };
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
              <Button
                loading={confirmLoading}
                css={css`
                  margin-top: ${rem(46)};
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
  },
);

export default withAuth('guest')(
  connect('accountStore')(pageWithTranslation(I18nNamespace.Auth)(Login)),
);
