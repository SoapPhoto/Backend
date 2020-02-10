import React, { ComponentType } from 'react';

import { ICustomNextContext } from '@lib/common/interfaces/global';
import { server } from '@lib/common/utils';
import { Router } from '@lib/routes';
import { AccountStore } from '@lib/stores/AccountStore';
import { store } from '@lib/stores/init';
import { reaction } from 'mobx';
import { Status } from '@common/enum/userStatus';

type Props = {accountStore?: AccountStore};

const getDisplayName = <P extends {}>(
  Component: ComponentType<P>,
) => Component.displayName || Component.name || 'Component';

export const withAuth = <P extends any>(role?: string) => (
  WrappedComponent: ComponentType<P>,
) => class extends React.Component<P> {
  public static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

  public static async getInitialProps(ctx: ICustomNextContext) {
    const { isLogin, userInfo } = store.accountStore;
    switch (role) {
      case 'guest':
        if (isLogin) {
          if (server && ctx && ctx.res) {
            if (ctx.req!.query.redirectUrl) {
              ctx.res.redirect(ctx.req!.query.redirectUrl);
            } else {
              ctx.res.redirect('/');
            }
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
      case 'user-verified':
        if (!isLogin) {
          if (server && ctx.res && ctx.req) {
            ctx.res.redirect(`/login?redirectUrl=${ctx.req.url}`);
          } else {
            Router.replaceRoute('/login');
          }
        } else if (userInfo && userInfo.status === Status.VERIFIED) {
          if (server && ctx.res && ctx.req) {
            ctx.res.redirect('/auth/verify');
          } else {
            Router.replaceRoute('/auth/verify');
          }
        }
        break;
      case 'user-unverified':
        if (!isLogin) {
          if (server && ctx.res && ctx.req) {
            ctx.res.redirect(`/login?redirectUrl=${ctx.req.url}`);
          } else {
            Router.replaceRoute('/login');
          }
        } else if (userInfo && userInfo.status === Status.UNVERIFIED) {
          if (server && ctx.res && ctx.req) {
            ctx.res.redirect('/');
          } else {
            Router.replaceRoute('/');
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
