import { NextComponentClass } from 'next';
import * as React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';
import { server } from '@pages/common/utils';
import { Router } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import { store } from '@pages/stores/init';

type component<P> = React.ComponentClass<P> | React.SFC<P>;

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
        ((WrappedComponent as any) as NextComponentClass).getInitialProps &&
        (await ((WrappedComponent as any) as NextComponentClass).getInitialProps!(ctx));

      return { ...componentProps };
    }
    public render () {
      return <WrappedComponent {...this.props} />;
    }
  };
};
