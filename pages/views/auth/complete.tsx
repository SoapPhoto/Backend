import React, { useState, useCallback } from 'react';
import { rem } from 'polished';
import styled from 'styled-components';
import { Formik } from 'formik';

import { Header, Title } from '@lib/styles/views/auth';
import { FieldInput } from '@lib/components/Formik';
import { Button } from '@lib/components/Button';
import { ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { box } from '@lib/common/utils/themes/common';
import { validator, isUserName } from '@common/validator';

interface IValues {
  username: string;
  name: string;
}

const Wrapper = styled.div`
  height: 100vh;
  &::before {
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
    content: '';
  }
`;

const Box = styled.div`
  ${props => box(props.theme, '480px', true)}
  padding: ${rem('52px')} ${rem('80px')};
  margin-bottom: ${rem(64)};
  margin-top: ${rem(64)};
`;

const Content = styled.div`
  display: inline-block;
  text-align: left;
  vertical-align: middle;
  width: 100%;
`;

const CompleteUserInfo: ICustomNextPage<IBaseScreenProps, any> = () => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleOk = () => {};
  const validate = useCallback((values: IValues) => {
    if (validator.isEmpty(values.username)) {
      return {
        username: '请填写用户名!',
      };
    }
    if (!isUserName(values.username)) {
      return {
        username: '请填写正确用户名!',
      };
    }
    return {};
  }, []);
  return (
    <Wrapper>
      <Content>
        <Box>
          <Header>
            <Title>完善账号信息</Title>
          </Header>
          <Formik<IValues>
            initialValues={{
              username: '',
              name: '',
            }}
            onSubmit={handleOk}
            validate={validate}
          >
            {({
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <FieldInput
                  required
                  name="username"
                  label="用户名（登录名）"
                />
                <FieldInput
                  style={{ marginTop: rem(24) }}
                  name="name"
                  label="昵称（显示的名称）"
                />
                <Button
                  loading={confirmLoading}
                  style={{ marginTop: rem(42), width: '100%' }}
                  type="submit"
                  disabled={isSubmitting}
                >
                    完成注册
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      </Content>
    </Wrapper>
  );
};
CompleteUserInfo.getInitialProps = async () => ({
  header: false,
});

export default CompleteUserInfo;
