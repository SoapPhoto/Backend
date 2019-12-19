import React, { useState } from 'react';

import { Wrapper, Title } from '@lib/containers/Auth/resetPassword';
import { Formik } from 'formik';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { Button } from '@lib/components/Button';
import { ResetPasswordSchema } from '@lib/common/dto/resetPassword';
import { resetPassword, newPassword as newPass } from '@lib/services/auth';
import Toast from '@lib/components/Toast';
import { rem } from 'polished';
import { useAccountStore } from '@lib/stores/hooks';
import { useTranslation } from '@lib/i18n/useTranslation';


const initForm = {
  password: '',
  newPassword: '',
  repeatPassword: '',
};

const Reset = () => {
  const { t } = useTranslation();
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
        Toast.warning(t('setting.reset_password.message.password_inconsistent'));
      }
      if (userInfo!.isPassword) {
        await resetPassword({ password, newPassword });
      } else {
        await newPass({ newPassword });
      }
      setSubmitting(true);
      Toast.success(t('setting.reset_password.message.success'));
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
      <Title>{t('setting.menu.resetPassword')}</Title>
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
                  label={t('setting.reset_password.password')}
                />
              )
            }
            <FieldInput
              type="password"
              name="newPassword"
              label={t('setting.reset_password.new_password')}
              style={{ marginTop: rem(24) }}
            />
            <FieldInput
              type="password"
              name="repeatPassword"
              label={t('setting.reset_password.again_new_password')}
              style={{ marginTop: rem(24) }}
            />
            <div
              style={{ textAlign: 'right' }}
            >
              <Button
                loading={confirmLoading}
                style={{ marginTop: rem(46) }}
                type="submit"
                disabled={isSubmitting}
              >
                {t('setting.reset_password.btn.confirm')}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Reset;
