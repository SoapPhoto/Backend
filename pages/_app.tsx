/// <reference types="styled-components/cssprop" />
import 'reflect-metadata';

import _ from 'lodash';
import { Provider } from 'mobx-react';
import moment from 'moment';
import App, { Container } from 'next/app';
import React from 'react';

import { PictureModal } from '@lib/components';
import { HttpStatus } from '@lib/common/enums/http';
import { parsePath, server } from '@lib/common/utils';
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
    const { ctx, Component } = data;
    const { req } = ctx;
    const theme = getCurrentTheme(req ? req.cookies : document ? document.cookie : '') as ThemeType;
    const route = parsePath(data.ctx.asPath);
    let statusCode = HttpStatus.OK;
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
      statusCode = ctx.query.error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (ctx.pathname === '/_error') {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    let pageProps = {
      ...basePageProps,
    };
    ctx.route = route;
    ctx.mobxStore = initStore(pageProps.initialStore);
    pageProps.initialStore = ctx.mobxStore;
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ...basePageProps,
        ...ctx,
      });
      pageProps = {
        ...pageProps,
        initialStore: _.merge(basePageProps.initialStore, pageProps.initialStore || {}),
      };
      pageProps.initialStore = ctx.mobxStore;
    }
    return {
      pageProps: {
        ...pageProps,
        statusCode,
      },
    };
  }

  public mobxStore: IMyMobxStore;

  constructor(props: any) {
    super(props);
    this.mobxStore = server ? props.pageProps.initialStore : initStore(props.pageProps.initialStore);
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
              <div css="background: #ccc" />
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

export default MyApp;
