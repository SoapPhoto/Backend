import dynamic from 'next/dynamic';
import { withRouter, WithRouterProps } from 'next/router';
import * as React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { parsePath } from '@pages/common/utils';
import { withAuth } from '@pages/components/router/withAuth';
import { Menu } from './components/Menu';
import { Warpper } from './style';

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
