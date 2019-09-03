import { WithRouterProps } from 'next/dist/client/with-router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { getTitle } from '@lib/common/utils';
import { withAuth } from '@lib/components/router/withAuth';
import { Menu } from '@lib/components/WrapperMenu';
import { Warpper } from '@lib/styles/views/setting';
import { UserType } from '@common/enum/router';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useRouter } from '@lib/router';

interface IProps extends WithRouterProps {
  type: UserType;
}


const Setting = () => {
  const { params } = useRouter();
  const { type } = params;
  const [types, setType] = useState(type as UserType);
  const { t } = useTranslation();
  useEffect(() => {
    setType(type as UserType);
  }, [type]);
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

export default withAuth<IProps>('user')(pageWithTranslation(I18nNamespace.Setting)(Setting));
