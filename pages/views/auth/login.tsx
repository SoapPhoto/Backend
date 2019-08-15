import { Formik, FormikActions } from 'formik';
import { WithRouterProps } from 'next/dist/client/with-router';
import Head from 'next/Head';
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
          <title>{getTitle('登录🔑')}</title>
        </Head>
        <Title>
          <Emojione
            svg
            text="登录🔑"
          />
        </Title>
        <Formik<IValues>
          initialValues={{
            username: '',
            password: '',
          }}
          onSubmit={handleOk}
          validationSchema={LoginSchema}
        >
          {({
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <FieldInput
                name="username"
                label="用户名"
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
                登录
              </Button>
            </form>
          )}
        </Formik>
      </Wrapper>
    );
  },
);

export default withAuth('guest')(
  connect('accountStore')(Login),
);
