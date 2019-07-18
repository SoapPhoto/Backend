import { WithRouterProps } from 'next/dist/client/with-router';
import dynamic from 'next/dynamic';
import Head from 'next/Head';
import { withRouter } from 'next/router';
import React from 'react';

import { CustomNextContext } from '@lib/common/interfaces/global';
import { getTitle, parsePath } from '@lib/common/utils';
import { withAuth } from '@lib/components/router/withAuth';
import { Menu } from '@lib/components/WrapperMenu';
import { Warpper } from '@lib/styles/views/setting';

interface IProps extends WithRouterProps {
  type: 'user' | 'basic';
}

const menu = [
  {
    value: 'profile',
    name: '用户设置',
    path: '/setting/profile',
    component: dynamic(() => import('./User')),
  },
  {
    value: 'basic',
    name: '基本设置',
    path: '/setting/basic',
    component: dynamic(() => import('./Basic')),
  },
];
class Setting extends React.Component<IProps> {
  public static async getInitialProps(ctx: CustomNextContext) {
    return {
      type: ctx.route.params.type,
    };
  }
  public static getDerivedStateFromProps(nextProps: IProps) {
    const route = parsePath(nextProps.router!.asPath!);
    return {
      type: route.params.type,
    };
  }

  public state = {
    type: this.props.type,
  };

  public render() {
    return (
      <Warpper>
        <Head>
          <title>{getTitle('设置')}</title>
        </Head>
        <Menu
          value={this.state.type}
          data={menu}
        />
      </Warpper>
    );
  }
}

export default withRouter(
  withAuth<IProps>('user')(Setting),
);
