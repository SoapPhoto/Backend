import { Formik, FormikActions } from 'formik';
import { WithRouterProps } from 'next/dist/client/with-router';
import Head from 'next/head';
import { withRouter } from 'next/router';
import React from 'react';
import { Emojione } from 'react-emoji-render';

import { SignUpSchema } from '@lib/common/dto/auth';
import { getTitle, parsePath } from '@lib/common/utils';
import { connect } from '@lib/common/utils/store';
import { Button } from '@lib/components/Button';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { withAuth } from '@lib/components/router/withAuth';
import Toast from '@lib/components/Toast';
import { Router } from '@lib/routes';
import { AccountStore } from '@lib/stores/AccountStore';
import { Title, Wrapper } from '@lib/styles/views/auth';
import { css } from 'styled-components';
import { rem } from 'polished';
import { useTranslation } from '@lib/i18n/useTranslation';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';

interface IProps extends WithRouterProps {
  accountStore: AccountStore;
}

interface IValues {
  email: string;
  username: string;
  password: string;
}

const SignUp = withRouter<IProps>(
  ({ accountStore, router }) => {
    const { t } = useTranslation();
    const { query } = parsePath(router!.asPath!);
    const { signup } = accountStore;
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const handleOk = async (value: IValues, { setSubmitting }: FormikActions<IValues>) => {
      setConfirmLoading(true);
      setSubmitting(false);
      try {
        await signup(value);
        setSubmitting(true);
        setTimeout(() => {
          if (query.redirectUrl) {
            Router.replaceRoute(query.redirectUrl);
          } else {
            Router.replaceRoute('/');
          }
        }, 400);
        Toast.success(t('signup_success'));
      } catch (error) {
        console.error(error);
        Toast.error(t(error.message));
        setSubmitting(false);
      } finally {
        setConfirmLoading(false);
      }
    };
    return (
      <Wrapper>
        <Head>
          <title>{getTitle('signup', t)}</title>
        </Head>
        <Title>
          <Emojione
            svg
            text={t('signup')}
          />
        </Title>
        <Formik<IValues>
          initialValues={{
            email: '',
            username: '',
            password: '',
          }}
          onSubmit={handleOk}
          validationSchema={SignUpSchema(t)}
        >
          {({
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <FieldInput
                name="email"
                label={t('email')}
              />
              <FieldInput
                name="username"
                label={t('username')}
                css={css`
                  margin-top: ${rem(24)};
                `}
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
                {t('signup_btn')}
              </Button>
            </form>
          )}
        </Formik>
      </Wrapper>
    );
  },
);

export default withAuth('guest')(
  connect('accountStore')(pageWithTranslation(I18nNamespace.Auth)(SignUp)),
);
