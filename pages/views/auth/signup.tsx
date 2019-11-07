import { Formik, FormikHelpers } from 'formik';
import React, { useCallback } from 'react';
import { NextSeo } from 'next-seo';

import { SignUpSchema } from '@lib/common/dto/auth';
import { getTitle } from '@lib/common/utils';
import { Button } from '@lib/components/Button';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { withAuth } from '@lib/components/router/withAuth';
import Toast from '@lib/components/Toast';
import {
  Title, Wrapper, Header, SubTitle,
} from '@lib/styles/views/auth';
import { rem } from 'polished';
import { useTranslation } from '@lib/i18n/useTranslation';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useRouter } from '@lib/router';
import { useAccountStore } from '@lib/stores/hooks';
import { withError } from '@lib/components/withError';
import { EmojiText } from '@lib/components';
import { A } from '@lib/components/A';

interface IValues {
  email: string;
  username: string;
  password: string;
}

const SignUp = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const { signup } = useAccountStore();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const push = useCallback(() => {
    if (query.redirectUrl) {
      window.location = query.redirectUrl as any;
    } else {
      window.location = '/' as any;
    }
  }, [query.redirectUrl]);
  const handleOk = async (value: IValues, { setSubmitting }: FormikHelpers<IValues>) => {
    setConfirmLoading(true);
    setSubmitting(false);
    try {
      await signup(value);
      setSubmitting(true);
      setTimeout(() => {
        push();
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
      <NextSeo
        title={getTitle('signup', t)}
        description="Sign Up to Soap"
      />
      <Header>
        <Title>
          <EmojiText
            text={t('signup')}
          />
        </Title>
        <SubTitle>
          已有账户？
          <A route="/login">登录</A>
        </SubTitle>
      </Header>
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
              style={{ marginTop: rem(24) }}
            />
            <FieldInput
              type="password"
              name="password"
              label={t('password')}
              style={{ marginTop: rem(24) }}
            />
            <Button
              loading={confirmLoading}
              style={{
                marginTop: rem(46),
                width: '100%',
              }}
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
};

export default withAuth('guest')(
  withError(pageWithTranslation(I18nNamespace.Auth)(SignUp)),
);
