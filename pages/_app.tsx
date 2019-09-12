/// <reference types="styled-components/cssprop" />
import 'reflect-metadata';

import { Provider } from 'mobx-react';
import App from 'next/app';
import React from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/zh-cn';

import { Router as RouterProvider } from '@lib/router';
import { PictureModal } from '@lib/components';
import { HttpStatus } from '@lib/common/enums/http';
import { parsePath, server } from '@lib/common/utils';
import { whoami } from '@lib/services/user';
import { UserEntity } from '@lib/common/interfaces/user';
import { ICustomNextAppContext } from '@lib/common/interfaces/global';
import { I18nProvider, II18nValue } from '@lib/i18n/I18nProvider';
import { initLocale, initI18n } from '@lib/i18n/utils';
import { RouterAction } from '@lib/stores/AppStore';
import { getCurrentTheme, ThemeType } from '../lib/common/utils/themes';
import { BodyLayout } from '../lib/containers/BodyLayout';
import { ThemeWrapper } from '../lib/containers/Theme';
import { Router } from '../lib/routes';
import {
  IInitialStore, IMyMobxStore, initStore, store,
} from '../lib/stores/init';


interface IProps {
  i18n: II18nValue;
  initialMobxState: IMyMobxStore;
  pageProps: IPageProps;
}

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

let timer: NodeJS.Timeout | undefined;

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

Router.events.on('routeChangeStart', () => {
  timer = setTimeout(() => {
    store.appStore.setLoading(true);
  }, 200);
});
Router.events.on('routeChangeComplete', () => {
  clearTimeout(timer!);
  store.appStore.setLoading(false);
});
Router.events.on('routeChangeError', () => {
  clearTimeout(timer!);
  store.appStore.setLoading(false);
});

export default class MyApp extends App<IProps> {
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
    let pageProps: any = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    const i18n = await initLocale(pageProps.namespacesRequired, req);
    if (res && statusCode !== HttpStatus.OK) {
      res.status(statusCode);
    }
    return {
      initialMobxState: mobxStore,
      i18n,
      pageProps: {
        ...pageProps,
        statusCode,
      },
    };
  }

  public static getDerivedStateFromProps(props: IProps) {
    return {
      i18n: props.i18n,
    };
  }

  public state = {
    i18n: this.props.i18n,
    mobxStore: this.props.initialMobxState,
  }

  constructor(props: IProps) {
    super(props as any);
    this.state.mobxStore = server ? props.initialMobxState : initStore(props.initialMobxState);
    this.state.i18n = server ? props.i18n : initI18n(props.i18n);
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
        action: RouterAction.POP,
      });
      return true;
    });
  }

  public render() {
    const {
      Component, pageProps, router,
    } = this.props;
    const { i18n, mobxStore } = this.state;
    const { picture } = router.query!;
    const isError = (pageProps.error && pageProps.error.statusCode >= 400) || pageProps.statusCode >= 400;
    return (
      <I18nProvider value={i18n}>
        <RouterProvider route={router}>
          <Provider {...mobxStore}>
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
        </RouterProvider>
      </I18nProvider>
    );
  }
}
