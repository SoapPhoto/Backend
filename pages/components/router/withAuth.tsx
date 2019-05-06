import cookie from 'cookie';
import { NextComponentClass } from 'next';
import * as React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { server } from '@pages/common/utils';
import { Router } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import { store } from '@pages/stores/init';

type component<P> = React.ComponentClass<P> | React.SFC<P>;

type Props = object & {accountStore: AccountStore};

const getDisplayName = <P extends Props>(Component: component<P>) =>
  Component.displayName || Component.name || 'Component';

export const withAuth = <P extends Props>(role?: string) => (WrappedComponent: component<P>) => {
  return class extends React.Component<P> {
    public static displayName = `withAuthSync(${getDisplayName<P>(WrappedComponent)})`;

    public static async getInitialProps (ctx: CustomNextContext) {
      let isLogin = store.accountStore.isLogin;
      if (!server) {
        const cookies = cookie.parse(document.cookie);
        if (!cookies.Authorization) {
          isLogin = false;
        }
      }
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
            if (server && ctx.res) {
              ctx.res.redirect('/login');
            } else {
              Router.replaceRoute('/login');
            }
          }
          break;
        default:
          break;
      }
      const componentProps =
        (WrappedComponent as NextComponentClass).getInitialProps &&
        (await (WrappedComponent as NextComponentClass).getInitialProps!(ctx));

      return { ...componentProps };
    }
    public render () {
      return <WrappedComponent {...this.props} />;
    }
  };
};
