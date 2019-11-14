import React, { useEffect } from 'react';
import { Router } from 'next/router';
import { ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { MessagePage } from '@lib/containers/Auth';
import { getTitle } from '@lib/common/utils';
import { NextSeo } from 'next-seo';
import { withAuth } from '@lib/components/router/withAuth';
import { withError } from '@lib/components/withError';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useTranslation } from '@lib/i18n/useTranslation';

const SignupMessage: ICustomNextPage<IBaseScreenProps, any> = () => {
  const { t } = useTranslation();
  useEffect(() => {
    Router.events.on('routeChangeStart', (data) => {
      window.location.href = data;
    });
  }, []);
  return (
    <>
      <NextSeo
        title={getTitle('验证邮箱', t)}
        noindex
      />
      <MessagePage
        title="请检查您的电子邮件"
        message={(
          <>
            <span>我们已发送激活邮箱到您的电子邮箱，激活后即可登录。</span>
            <span>如果没有收到电子邮件，请检查您的</span>
            <strong>垃圾邮件文件夹</strong>
            <span>。</span>
          </>
        )}
      />
    </>
  );
};

SignupMessage.getInitialProps = async () => ({
  header: false,
});

export default withAuth('guest')(
  withError(pageWithTranslation(I18nNamespace.Auth)(SignupMessage)),
);
