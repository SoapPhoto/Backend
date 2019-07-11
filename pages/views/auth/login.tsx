import { Formik } from 'formik';
import { WithRouterProps } from 'next/dist/client/with-router';
import Head from 'next/Head';
import { withRouter } from 'next/router';
import React from 'react';
import { Emojione } from 'react-emoji-render';

import { getTitle, parsePath } from '@pages/common/utils';
import { connect } from '@pages/common/utils/store';
import { Button } from '@pages/components/Button';
import { FieldInput } from '@pages/components/Formik/FieldInput';
import { withAuth } from '@pages/components/router/withAuth';
import Toast from '@pages/components/Toast';
import { Key } from '@pages/icon';
import { Router } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import { LoginSchema } from './dto';
import { Title, Wrapper } from './styles';

interface IProps extends WithRouterProps {
  accountStore: AccountStore;
}

const initForm = {
  username: '',
  password: '',
};

const Login = withRouter<IProps>(
  ({ accountStore, router }) => {
    const { query } = parsePath(router!.asPath!);
    const { login } = accountStore;
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const handleOk = async (value: typeof initForm, setSubmitting: (data: any) => void) => {
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
        Toast.error('登录失败');
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
        <Formik
          initialValues={initForm}
          onSubmit={(values, { setSubmitting }) => {
            handleOk(values, setSubmitting);
          }}
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
