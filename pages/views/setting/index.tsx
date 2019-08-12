import { WithRouterProps } from 'next/dist/client/with-router';
import dynamic from 'next/dynamic';
import Head from 'next/Head';
import { withRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { ICustomNextPage } from '@lib/common/interfaces/global';
import { getTitle, parsePath } from '@lib/common/utils';
import { withAuth } from '@lib/components/router/withAuth';
import { Menu } from '@lib/components/WrapperMenu';
import { Warpper } from '@lib/styles/views/setting';
import { UserType } from '@common/enum/router';

interface IProps extends WithRouterProps {
  type: UserType;
}

const menu = [
  {
    value: 'profile',
    name: '用户设置',
    path: '/setting/profile',
    component: dynamic(() => import('./User')),
  },
  {
    value: 'resetPassword',
    name: '重置密码',
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

const Setting: ICustomNextPage<IProps, {type: UserType}> = ({
  type,
  router,
}) => {
  const [types, setType] = useState(type);
  useEffect(() => {
    const route = parsePath(router.asPath);
    setType((route.params.type as UserType));
  }, [router]);
  return (
    <Warpper>
      <Head>
        <title>{getTitle('设置')}</title>
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
  withAuth<IProps>('user')(Setting),
);
