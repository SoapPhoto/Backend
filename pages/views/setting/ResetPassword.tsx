import React from 'react';

import { Wrapper, Title } from '@lib/containers/Auth/resetPassword';
import { Formik } from 'formik';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { Button } from '@lib/components/Button';
import { ResetPasswordSchema } from '@lib/common/dto/resetPassword';
import { resetPassword } from '@lib/services/auth';
import Toast from '@lib/components/Toast';


const initForm = {
  password: '',
  newPassword: '',
  repeatPassword: '',
};

const reset = () => {
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const handleOk = async (
    { password, newPassword, repeatPassword }: typeof initForm,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setConfirmLoading(true);
    setSubmitting(false);
    try {
      if (newPassword !== repeatPassword) {
        Toast.warning('请确保两次密码输入一致。');
      }
      await resetPassword({ password, newPassword });
      setSubmitting(true);
      Toast.success('修改成功，请重新登录！');
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
        validationSchema={ResetPasswordSchema}
      >
        {({
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <FieldInput
              type="password"
              name="password"
              label="旧密码"
            />
            <FieldInput
              type="password"
              name="newPassword"
              label="新密码"
              style={{ marginTop: '24px' }}
            />
            <FieldInput
              type="password"
              name="repeatPassword"
              label="再次输入新密码"
              style={{ marginTop: '24px' }}
            />
            <div style={{ textAlign: 'right' }}>
              <Button
                loading={confirmLoading}
                style={{ marginTop: '46px' }}
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

export default reset;
