import { Formik } from 'formik';
import { inject, observer } from 'mobx-react';
import { WithRouterProps } from 'next/dist/client/with-router';
import Head from 'next/Head';
import { withRouter } from 'next/router';
import React from 'react';

import { getTitle, parsePath } from '@pages/common/utils';
import { connect } from '@pages/common/utils/store';
import { Button } from '@pages/components/Button';
import { Input } from '@pages/components/Input';
import { withAuth } from '@pages/components/router/withAuth';
import Toast from '@pages/components/Toast';
import { Key } from '@pages/icon';
import { Router } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import { validator } from '@server/common/utils/validator';
import { LoginSchema } from './dto';
import { Title, Wrapper } from './styles';

interface IProps extends WithRouterProps {
  accountStore: AccountStore;
}

const Login = withRouter<IProps>(
  ({ accountStore, router }) => {
    const { query } = parsePath(router!.asPath!);
    const { login, isLogin } = accountStore;
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const handleOk = async () => {
      setConfirmLoading(true);
      try {
        // await login(username, password);
        if (query.redirectUrl) {
          Router.replaceRoute(query.redirectUrl);
        } else {
          Router.replaceRoute('/');
        }
        Toast.success('登录成功！');
      } finally {
        setConfirmLoading(false);
      }
    };
    return (
      <Wrapper>
        <Head>
          <title>{getTitle('登录')}</title>
        </Head>
        <Title>登录 <Key /></Title>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            setSubmitting(true);
          }}
          validationSchema={LoginSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Input
                label="用户名"
                type="text"
                value={values.username}
                onChange={handleChange}
                name="username"
                error={errors.username}
              />
              <Input
                label="密码"
                type="password"
                value={values.password}
                onChange={handleChange}
                name="password"
                error={errors.password}
                style={{ marginTop: '24px' }}
              />
              <Button
                loading={confirmLoading}
                style={{ marginTop: '24px', width: '100%' }}
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
