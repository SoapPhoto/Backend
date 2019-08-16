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
        Toast.success('注册成功！');
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      } finally {
        setConfirmLoading(false);
      }
    };
    return (
      <Wrapper>
        <Head>
          <title>{getTitle('注册🔑')}</title>
        </Head>
        <Title>
          <Emojione
            svg
            text="注册🔑"
          />
        </Title>
        <Formik<IValues>
          initialValues={{
            email: '',
            username: '',
            password: '',
          }}
          onSubmit={handleOk}
          validationSchema={SignUpSchema}
        >
          {({
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <FieldInput
                name="email"
                label="电子邮箱"
              />
              <FieldInput
                name="username"
                label="用户名"
                style={{ marginTop: '24px' }}
              />
              <FieldInput
                type="password"
                name="password"
                label="密码"
                style={{ marginTop: '24px' }}
              />
              <Button
                loading={confirmLoading}
                style={{ marginTop: '46px', width: '100%' }}
                type="submit"
                disabled={isSubmitting}
              >
                注册
              </Button>
            </form>
          )}
        </Formik>
      </Wrapper>
    );
  },
);

export default withAuth('guest')(
  connect('accountStore')(SignUp),
);
