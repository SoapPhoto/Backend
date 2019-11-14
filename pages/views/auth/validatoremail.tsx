import React, { useEffect } from 'react';
import Router from 'next/router';

import { ICustomNextPage, IBaseScreenProps } from '@lib/common/interfaces/global';
import { validatorEmail } from '@lib/services/auth';
import { MessagePage } from '@lib/containers/Auth';
import { withAuth } from '@lib/components/router/withAuth';
import { withError } from '@lib/components/withError';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { getTitle } from '@lib/common/utils';
import { useTranslation } from '@lib/i18n/useTranslation';
import { NextSeo } from 'next-seo';
import Head from 'next/head';

interface IProps extends IBaseScreenProps {
  info?: {
    statusCode: number;
    message: string;
  };
}

const ValidatorEmail: ICustomNextPage<IProps, Omit<IProps, 'error'>> = ({ info }) => {
  const { t } = useTranslation();
  useEffect(() => {
    Router.events.on('routeChangeStart', (data) => {
      window.location.href = data;
    });
  }, []);
  const title = info ? t(`validatoremail.${info.message}`) : '验证成功!';
  return (
    <>
      <NextSeo
        title={getTitle(title, t)}
      />
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <MessagePage
        title={title}
      />
    </>
  );
};

ValidatorEmail.getInitialProps = async (ctx: any) => {
  try {
    await validatorEmail(ctx.query);
    return {
      header: false,
    };
  } catch (err) {
    const info = {
      statusCode: 500,
      message: '错误！',
    };
    if (err && err.response && err.response.data) {
      if (!Array.isArray(err.response.data.message)) {
        info.message = err.response.data.message;
      }
      info.statusCode = err.response.data.statusCode;
    }
    return {
      info,
      header: false,
    };
  }
};

export default withError(pageWithTranslation(I18nNamespace.Auth)(ValidatorEmail));
