import React, { useState } from 'react';

import { Wrapper, Title } from '@lib/containers/Auth/resetPassword';
import { Formik } from 'formik';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { Button } from '@lib/components/Button';
import { ResetPasswordSchema } from '@lib/common/dto/resetPassword';
import { resetPassword, newPassword as newPass } from '@lib/services/auth';
import Toast from '@lib/components/Toast';
import { css } from 'styled-components';
import { rem } from 'polished';
import { useAccountStore } from '@lib/stores/hooks';


const initForm = {
  password: '',
  newPassword: '',
  repeatPassword: '',
};

const Reset = () => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { userInfo } = useAccountStore();
  const handleOk = async (
    { password, newPassword, repeatPassword }: typeof initForm,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    setConfirmLoading(true);
    setSubmitting(false);
    try {
      if (newPassword !== repeatPassword) {
        Toast.warning('请确保两次密码输入一致。');
      }
      if (userInfo!.isPassword) {
        await resetPassword({ password, newPassword });
      } else {
        await newPass({ newPassword });
      }
      setSubmitting(true);
      Toast.success('修改成功，请重新登录！');
      setTimeout(() => window.location.href = '/login', 300);
    } catch (error) {
      setSubmitting(false);
      // Toast.error('登录失败');
    } finally {
      setConfirmLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>重置密码</Title>
      <Formik
        initialValues={initForm}
        onSubmit={(values, { setSubmitting }) => {
          handleOk(values, setSubmitting);
        }}
        validationSchema={ResetPasswordSchema(userInfo!.isPassword)}
      >
        {({
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            {
              userInfo!.isPassword && (
                <FieldInput
                  type="password"
                  name="password"
                  label="旧密码"
                />
              )
            }
            <FieldInput
              type="password"
              name="newPassword"
              label="新密码"
              css={css`
                margin-top: ${rem(24)};
              `}
            />
            <FieldInput
              type="password"
              name="repeatPassword"
              label="再次输入新密码"
              css={css`
                margin-top: ${rem(24)};
              `}
            />
            <div
              css={css`
                  text-align: right;
              `}
            >
              <Button
                loading={confirmLoading}
                css={css`
                  margin-top: ${rem(46)};
                `}
                type="submit"
                disabled={isSubmitting}
              >
                更改密码
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Reset;
