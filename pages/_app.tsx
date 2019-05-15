import * as _ from 'lodash';
import { Provider } from 'mobx-react';
import App, { Container } from 'next/app';
import * as React from 'react';

import { parsePath, server } from '@pages/common/utils';
import { CustomNextAppContext } from './common/interfaces/global';
import { getCurrentTheme, ThemeType } from './common/utils/themes';
import { PictureModal } from './components';
import { BodyLayout } from './containers/BodyLayout';
import { ThemeWrapper } from './containers/Theme';
import { Router } from './routes';
import { IInitialStore, IMyMobxStore, initStore, store } from './stores/init';

interface IPageProps {
  initialStore: IInitialStore;
  error?: {
    error?: string;
    statusCode: number;
    message?: string;
  };
}
Router.events.on('routeChangeStart', (url: string) => {
  store.appStore.setLoading(true);
});
Router.events.on('routeChangeComplete', () => store.appStore.setLoading(false));
Router.events.on('routeChangeError', () =>  store.appStore.setLoading(false));

export default class MyApp extends App {
  public static async getInitialProps(data: CustomNextAppContext<any>) {
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
      },
    };
    if (ctx.query.error) {
      basePageProps.error = ctx.query.error;
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
    const { picture } = router.query as any;
    return (
      <Container>
        <Provider {...this.mobxStore}>
          <ThemeWrapper>
            <BodyLayout header={!pageProps.error}>
              {
                picture &&
                <PictureModal pictureId={picture} />
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
