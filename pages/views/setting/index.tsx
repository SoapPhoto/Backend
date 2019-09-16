import { WithRouterProps } from 'next/dist/client/with-router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { getTitle } from '@lib/common/utils';
import { withAuth } from '@lib/components/router/withAuth';
import { Menu } from '@lib/components/WrapperMenu';
import { Warpper } from '@lib/styles/views/setting';
import { SettingType } from '@common/enum/router';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useRouter } from '@lib/router';

interface IProps extends WithRouterProps {
  type: SettingType;
}
const components: Record<SettingType, any> = {
  profile: dynamic(() => import('./User')),
  account: dynamic(() => import('./Account')),
  resetPassword: dynamic(() => import('./ResetPassword')),
};

const Setting = () => {
  const { params } = useRouter();
  const { type } = params;
  const [types, setType] = useState(type as SettingType);
  const { t } = useTranslation();
  useEffect(() => {
    setType(type as SettingType);
  }, [type]);
  const menu = [
    {
      value: 'profile',
      name: t('setting_menu.profile'),
      path: '/setting/profile',
    },
    {
      value: 'account',
      name: t('setting_menu.account'),
      path: '/setting/account',
    },
    {
      value: 'resetPassword',
      name: t('setting_menu.resetPassword'),
      path: '/setting/resetPassword',
    },
  ];
  const currentMenu = menu.find(m => m.value === types);
  const CurentCompoent = components[types];
  return (
    <Warpper>
      <Head>
        <title>{getTitle(currentMenu!.name, t)}</title>
      </Head>
      <Menu
        value={types}
        data={menu}
      >
        <CurentCompoent />
      </Menu>
    </Warpper>
  );
};

export default withAuth<IProps>('user')(pageWithTranslation(I18nNamespace.Setting)(Setting));
