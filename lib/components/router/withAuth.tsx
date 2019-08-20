import { NextComponentType } from 'next';
import React from 'react';

import { ICustomNextContext } from '@lib/common/interfaces/global';
import { server } from '@lib/common/utils';
import { Router } from '@lib/routes';
import { AccountStore } from '@lib/stores/AccountStore';
import { store } from '@lib/stores/init';
import { reaction } from 'mobx';

type component<P> = React.ComponentClass<P> | React.FC<P>;

type Props = object & {accountStore?: AccountStore};

// eslint-disable-next-line max-len
const getDisplayName = <P extends Props>(Component: component<P>) => Component.displayName || Component.name || 'Component';

// eslint-disable-next-line max-len
export const withAuth = <P extends Props>(role?: string) => (WrappedComponent: component<P>) => class extends React.Component<P> {
  public static displayName = `withAuthSync(${getDisplayName<P>(WrappedComponent)})`;

  public static async getInitialProps(ctx: ICustomNextContext) {
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
    const componentProps = ((WrappedComponent as any) as any).getInitialProps
        && (await ((WrappedComponent as any) as any).getInitialProps!(ctx));

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

  public render() {
    const { isOk } = this.state;
    if (isOk) {
      return <WrappedComponent {...this.props} />;
    }
    return null;
  }
};
