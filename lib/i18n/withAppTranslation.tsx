import App from 'next/app';
import React from 'react';
import { ICustomNextAppContext } from '@lib/common/interfaces/global';
import { getDisplayName } from 'next/dist/next-server/lib/utils';
import { server } from '@lib/common/utils';
import { initLocale, initI18n } from './utils';
import { I18nProvider, II18nValue } from './I18nProvider';

interface IProps {
  i18n: II18nValue;
}

export function withAppTranslation(WrappedComponent: typeof App) {
  const withDisplayName = `WithAppTranslation(${getDisplayName(WrappedComponent)})`;
  class WithAppTranslation extends React.Component<IProps> {
    public static displayName = withDisplayName;

    public static async getInitialProps(data: ICustomNextAppContext) {
      const { ctx } = data;
      const { req } = ctx;
      let wrappedComponentProps: any = {};
      if (WrappedComponent.getInitialProps) {
        wrappedComponentProps = await WrappedComponent.getInitialProps(data as any);
      }
      if (typeof wrappedComponentProps.pageProps === 'undefined') {
        console.error(
          // eslint-disable-next-line max-len
          'If you have a getInitialProps method in your custom _app.js file, you must explicitly return pageProps. For more information, see: https://github.com/zeit/next.js#custom-app',
        );
      }
      const i18n = await initLocale(wrappedComponentProps.pageProps.namespacesRequired, req);
      return {
        ...wrappedComponentProps,
        i18n,
      };
    }

    public static getDerivedStateFromProps(props: IProps) {
      return {
        i18n: props.i18n,
      };
    }

    public state = {
      i18n: this.props.i18n,
    }

    constructor(props: IProps) {
      super(props as any);
      this.state.i18n = server ? props.i18n : initI18n(props.i18n);
    }

    public render() {
      const { i18n } = this.state;
      return (
        <I18nProvider value={i18n}>
          <WrappedComponent {...this.props as any} />
        </I18nProvider>
      );
    }
  }
  return (WithAppTranslation as any) as typeof App;
}
