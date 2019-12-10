import { WithRouterProps } from 'next/dist/client/with-router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { getTitle } from '@lib/common/utils';
import { withAuth } from '@lib/components/router/withAuth';
import { Menu } from '@lib/components/WrapperMenu';
import { Wrapper } from '@lib/styles/views/setting';
import { SettingType } from '@common/enum/router';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useRouter } from '@lib/router';
import { User, AtSign, Lock } from '@lib/icon';

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
      name: t('setting.menu.profile'),
      path: '/setting/profile',
      icon: User,
    },
    {
      value: 'account',
      name: t('setting.menu.account'),
      path: '/setting/account',
      icon: AtSign,
    },
    {
      value: 'resetPassword',
      name: t('setting.menu.resetPassword'),
      path: '/setting/resetPassword',
      icon: Lock,
    },
  ];
  const currentMenu = menu.find(m => m.value === types);
  const CurrentComponent = components[types];
  return (
    <Wrapper>
      <Head>
        <title>{getTitle(currentMenu!.name, t)}</title>
      </Head>
      <Menu
        value={types}
        data={menu}
      >
        <CurrentComponent />
      </Menu>
    </Wrapper>
  );
};

export default withAuth<IProps>('user')(pageWithTranslation(I18nNamespace.Setting)(Setting));
