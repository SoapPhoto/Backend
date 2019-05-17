import { NextComponentClass } from 'next';
import * as React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { server } from '@pages/common/utils';
import { Router } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import { store } from '@pages/stores/init';
import { reaction } from 'mobx';

type component<P> = React.ComponentClass<P> | React.FC<P>;

type Props = object & {accountStore?: AccountStore};

const getDisplayName = <P extends Props>(Component: component<P>) =>
  Component.displayName || Component.name || 'Component';

export const withAuth = <P extends Props>(role?: string) => (WrappedComponent: component<P>) => {
  return class extends React.Component<P> {
    public static displayName = `withAuthSync(${getDisplayName<P>(WrappedComponent)})`;

    public static async getInitialProps (ctx: CustomNextContext) {
      const { isLogin } = store.accountStore;
      switch (role) {
        case 'guest':
          if (isLogin) {
            if (server && ctx.res) {
              ctx.res.redirect('/');
            } else {
              Router.replaceRoute('/');
            }
          }
          break;
        case 'user':
          if (!isLogin) {
            if (server && ctx.res && ctx.req) {
              ctx.res.redirect(`/login?redirectUrl=${ctx.req.url}`);
            } else {
              Router.replaceRoute('/login');
            }
          }
          break;
        default:
          break;
      }
      const componentProps =
        ((WrappedComponent as any) as NextComponentClass).getInitialProps &&
        (await ((WrappedComponent as any) as NextComponentClass).getInitialProps!(ctx));

      return { ...componentProps };
    }
    public state = {
      isOk: true,
    };
    constructor(props: P) {
      super(props);
      reaction(
        () => store.accountStore.isLogin,
        (isLogin) => {
          // 假如登录之后退出登录，退回到首页
          if (role === 'user' && !isLogin) {
            window.location.href = '/';
          }
        },
      );
    }
    public render () {
      if (this.state.isOk) {
        return <WrappedComponent {...this.props} />;
      }
      return null;
    }
  };
};
