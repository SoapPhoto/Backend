import App, { Container } from 'next/app';
import * as React from 'react';

import { Provider } from 'mobx-react';
import { CustomNextAppContext } from './common/interfaces/global';
import { BodyLayout } from './containers/BodyLayout';
import { ThemeWrapper } from './containers/Theme';
import { IMyMobxStore, initStore } from './stores/init';

const server = typeof window === 'undefined';

export default class MyApp extends App {
  public static async getInitialProps(data: CustomNextAppContext<any>) {
    const { ctx, Component } = data;
    const mobxStore = initStore({
      accountStore: ctx.query.accountStore,
    });
    ctx.mobxStore = mobxStore;
    const basePageProps = {
      initialStore: mobxStore,
    };
    let pageProps = {
      ...basePageProps,
    };
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ...basePageProps,
        ...ctx,
      });
      pageProps = {
        ...basePageProps,
        ...pageProps,
      };
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
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Provider {...this.mobxStore}>
          <ThemeWrapper>
            <BodyLayout>
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
