import 'reflect-metadata';

import _ from 'lodash';
import { Provider } from 'mobx-react';
import App, { Container } from 'next/app';
import React from 'react';

import { parsePath, server } from '@pages/common/utils';
import { getCurrentTheme, ThemeType } from './common/utils/themes';
import { PictureModal } from './components';
import { BodyLayout } from './containers/BodyLayout';
import { ThemeWrapper } from './containers/Theme';
import { Router } from './routes';
import { IInitialStore, IMyMobxStore, initStore, store } from './stores/init';

interface IPageError {
  error?: string;
  statusCode: number;
  message?: string;
}

interface IPageProps {
  initialStore: IInitialStore;
  error?: IPageError;
}

Router.events.on('routeChangeStart', (url: string) => {
  store.appStore.setLoading(true);
});
Router.events.on('routeChangeComplete', () => store.appStore.setLoading(false));
Router.events.on('routeChangeError', () =>  store.appStore.setLoading(false));

export default class MyApp extends App {

  // 初始化页面数据，初始化store
  public static async getInitialProps(data: any) {
    const { ctx, Component } = data;
    const { req } = ctx;
    const theme = getCurrentTheme(req ? req.cookies : document ? document.cookie : '') as ThemeType;
    const route = parsePath(data.ctx.asPath);
    const basePageProps: IPageProps = {
      initialStore: {
        accountStore: {
          userInfo: req ? req.user : undefined,
        },
        themeStore: {
          theme,
        },
        screen: {},
      },
    };
    if (ctx.query.error) {
      basePageProps.error = (ctx.query.error as any) as IPageError;
    }
    let pageProps = {
      ...basePageProps,
    };
    ctx.route = route;
    ctx.mobxStore = pageProps.initialStore = initStore(pageProps.initialStore);
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ...basePageProps,
        ...ctx,
      });
      pageProps = {
        ...pageProps,
        initialStore: _.merge(basePageProps.initialStore, pageProps.initialStore || {}),
      };
      ctx.mobxStore = pageProps.initialStore = initStore(pageProps.initialStore);
    }
    return {
      pageProps,
    };
  }
  public mobxStore: IMyMobxStore;

  constructor(props: any) {
    super(props);
    this.mobxStore = server ? props.pageProps.initialStore : initStore(props.pageProps.initialStore);
  }
  public componentDidMount() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((_reg) => {
          console.log('service worker registration successful');
        })
        .catch((err) => {
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
    const isError = pageProps.error || ['/views/404'].indexOf(router.route) >= 0;
    return (
      <Container>
        <Provider {...this.mobxStore}>
          <ThemeWrapper>
            <BodyLayout header={!isError}>
              {
                picture &&
                <PictureModal pictureId={picture.toString()} />
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
