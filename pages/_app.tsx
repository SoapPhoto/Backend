/// <reference types="styled-components/cssprop" />
import 'reflect-metadata';

import { Provider } from 'mobx-react';
import moment from 'moment';
import App, { Container } from 'next/app';
import React from 'react';

import { PictureModal } from '@lib/components';
import { HttpStatus } from '@lib/common/enums/http';
import { parsePath, server } from '@lib/common/utils';
import { whoami } from '@lib/services/user';
import { UserEntity } from '@lib/common/interfaces/user';
import { ICustomNextAppContext } from '@lib/common/interfaces/global';
import { appWithTranslation } from '@common/i18n';
import { getCurrentTheme, ThemeType } from '../lib/common/utils/themes';
import { BodyLayout } from '../lib/containers/BodyLayout';
import { ThemeWrapper } from '../lib/containers/Theme';
import { Router } from '../lib/routes';
import {
  IInitialStore, IMyMobxStore, initStore, store,
} from '../lib/stores/init';

moment.locale('zh-cn');

interface IPageError {
  error?: string;
  statusCode: number;
  message?: string;
}

interface IPageProps {
  initialStore: IInitialStore;
  error?: IPageError;
  statusCode?: number;
}

Router.events.on('routeChangeStart', () => {
  store.appStore.setLoading(true);
});
Router.events.on('routeChangeComplete', () => store.appStore.setLoading(false));
Router.events.on('routeChangeError', () => store.appStore.setLoading(false));

class MyApp extends App {
  // 初始化页面数据，初始化store
  public static async getInitialProps(data: any) {
    const { ctx, Component } = data as ICustomNextAppContext;
    const { req, res } = ctx;
    const theme = getCurrentTheme(req ? req.cookies : (document ? document.cookie : '')) as ThemeType;
    const route = parsePath(data.ctx.asPath);
    let statusCode = HttpStatus.OK;
    let user: UserEntity | undefined;
    if (req && req.cookies.Authorization && req.path !== '/authenticate') {
      try {
        ({ data: user } = await whoami(req.cookies));
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
    if (ctx.query.error) {
      statusCode = ctx.query.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (res && res.statusCode >= 400) {
      statusCode = res.statusCode;
    } else if (ctx.pathname === '/_error') {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    const mobxStore = initStore(basePageProps.initialStore);
    ctx.route = route;
    ctx.mobxStore = mobxStore;
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    if (res && statusCode !== HttpStatus.OK) {
      res.status(statusCode);
    }
    return {
      initialMobxState: mobxStore,
      pageProps: {
        ...pageProps,
        statusCode,
      },
    };
  }

  public mobxStore: IMyMobxStore;

  constructor(props: any) {
    super(props);
    this.mobxStore = server ? props.initialMobxState : initStore(props.initialMobxState);
  }

  public componentDidMount() {
    // const socket = setupSocket();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => {
          // eslint-disable-next-line no-console
          console.log('service worker registration successful');
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.warn('service worker registration failed', err.message);
        });
    }
    Router.beforePopState(({ url, as, options }) => {
      store.appStore.setRoute({
        as,
        options,
        href: url,
        action: 'POP',
      });
      return true;
    });
  }

  public render() {
    const { Component, pageProps, router } = this.props;
    const { picture } = router.query!;
    const isError = (pageProps.error && pageProps.error.statusCode >= 400) || pageProps.statusCode >= 400;
    return (
      <Container>
        <Provider {...this.mobxStore}>
          <ThemeWrapper>
            <BodyLayout header={!isError}>
              {
                picture
                && <PictureModal pictureId={picture.toString()} />
              }
              <Component
                {...pageProps}
              />
            </BodyLayout>
          </ThemeWrapper>
        </Provider>
      </Container>
    );
  }
}

export default appWithTranslation(MyApp);
