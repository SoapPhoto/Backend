import { WithRouterProps } from 'next/dist/client/with-router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { ICustomNextPage } from '@lib/common/interfaces/global';
import { getTitle, parsePath } from '@lib/common/utils';
import { withAuth } from '@lib/components/router/withAuth';
import { Menu } from '@lib/components/WrapperMenu';
import { Warpper } from '@lib/styles/views/setting';
import { UserType } from '@common/enum/router';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useTranslation } from '@lib/i18n/useTranslation';

interface IProps extends WithRouterProps {
  type: UserType;
}


const Setting: ICustomNextPage<IProps, {type: UserType}> = ({
  type,
  router,
}) => {
  const [types, setType] = useState(type);
  const { t } = useTranslation();
  useEffect(() => {
    const route = parsePath(router.asPath);
    setType((route.params.type as UserType));
  }, [router]);
  const menu = [
    {
      value: 'profile',
      name: t('setting_menu.profile'),
      path: '/setting/profile',
      component: dynamic(() => import('./User')),
    },
    {
      value: 'resetPassword',
      name: t('setting_menu.resetPassword'),
      path: '/setting/resetPassword',
      component: dynamic(() => import('./ResetPassword')),
    },
    // {
    //   value: 'basic',
    //   name: '基本设置',
    //   path: '/setting/basic',
    //   component: dynamic(() => import('./Basic')),
    // },
  ];
  return (
    <Warpper>
      <Head>
        <title>{getTitle('setting', t)}</title>
      </Head>
      <Menu
        value={types}
        data={menu}
      />
    </Warpper>
  );
};

Setting.getInitialProps = async ctx => ({
  type: ctx.route.params.type as UserType,
});

export default withRouter(
  withAuth<IProps>('user')(pageWithTranslation(I18nNamespace.Setting)(Setting)),
);
