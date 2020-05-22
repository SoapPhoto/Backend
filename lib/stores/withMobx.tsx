import React from 'react';
import App from 'next/app';
import { Provider } from 'mobx-react';
import { reaction } from 'mobx';

import { getDisplayName } from 'next/dist/next-server/lib/utils';
import { ICustomNextAppContext } from '@lib/common/interfaces/global';
import { getCurrentTheme, ThemeType } from '@lib/common/utils/themes';
import { UserEntity } from '@lib/common/interfaces/user';
import { Whoami } from '@lib/schemas/query';
import { parsePath, server, Histore } from '@lib/common/utils';
import { Router } from '@lib/routes';
import { initStore, IInitialStore, IMyMobxStore } from './init';
import { RouterAction } from './AppStore';

interface IPageProps {
  initialStore: IInitialStore;
}

interface IWithMobxProps {
  initialMobxState: IMyMobxStore;
}

export function withMobx(WrappedComponent: typeof App) {
  const withDisplayName = `WithMobx(${getDisplayName(WrappedComponent as any)})`;

  class WithMobx extends React.Component<IWithMobxProps> {
    public static displayName = withDisplayName;

    public static async getInitialProps(data: ICustomNextAppContext) {
      const { ctx } = data;
      const { req, res, apolloClient } = ctx;
      const theme = getCurrentTheme(req ? req.cookies : (document ? document.cookie : '')) as ThemeType;
      const route = parsePath(ctx.asPath);
      let user: UserEntity | undefined;
      let wrappedComponentProps: any = {};
      if (req && apolloClient && req.cookies.Authorization && req.path !== '/authenticate') {
        try {
          const { data: info } = await apolloClient.query<{whoami: UserEntity}>({
            query: Whoami,
          });
          user = info.whoami;
        } catch (err) {
          if (err.status === 401) {
            res!.redirect(302, `/authenticate?redirectUrl=${req.path}`);
          }
        }
      }
      const basePageProps: IPageProps = {
        initialStore: {
          accountStore: {
            userInfo: user,
          },
          themeStore: {
            theme,
          },
          screen: {},
        },
      };
      const mobxStore = initStore(basePageProps.initialStore, apolloClient);
      ctx.route = route;
      ctx.mobxStore = mobxStore;
      if (WrappedComponent.getInitialProps) {
        wrappedComponentProps = await WrappedComponent.getInitialProps(data as any);
      }
      return { initialMobxState: mobxStore, ...wrappedComponentProps };
    }

    public state = {
      mobxStore: this.props.initialMobxState,
    }

    constructor(props: any) {
      super(props as any);
      this.state.mobxStore = server ? props.initialMobxState : initStore(props.initialMobxState, props.apollo);
    }


    public componentDidMount() {
      const { mobxStore } = this.state;
      if (mobxStore.accountStore.isLogin) {
        mobxStore.notificationStore.createSocket();
      }
      reaction(() => mobxStore.accountStore.isLogin, (isLogin) => {
        if (isLogin) {
          mobxStore.notificationStore.createSocket();
        } else {
          mobxStore.notificationStore.close();
        }
      });
      Router.beforePopState(({ url, as, options }) => {
        Histore.set('modal', Histore.get('modal'));
        mobxStore.appStore.setRoute({
          as,
          options,
          href: url,
          action: RouterAction.POP,
        });
        return true;
      });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    render() {
      const { mobxStore } = this.state;
      return (
        <Provider {...mobxStore}>
          <WrappedComponent {...this.props as any} />
        </Provider>
      );
    }
  }
  return (WithMobx as any) as typeof App;
}
