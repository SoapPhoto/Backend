import { flatten } from 'lodash';
import React, { Component, ComponentType } from 'react';


import { ICustomNextContext, IBaseScreenProps } from '@lib/common/interfaces/global';
import { I18nProvider } from './I18nProvider';
import { Namespace } from './Namespace';

export const pageWithTranslation = <P extends IBaseScreenProps>(namespaces: Namespace | Namespace[]) => (
  Page: ComponentType<P>,
) => {
  const namespacesRequired = [...flatten([namespaces]), Namespace.Common];

  return class PageWithTranslation extends Component<P> {
    public static async getInitialProps(appContext: ICustomNextContext) {
      let appProps = {};
      if (typeof (Page as any).getInitialProps === 'function') {
        appProps = await (Page as any).getInitialProps(appContext);
      }

      return {
        ...appProps,
        namespacesRequired,
      };
    }

    public render() {
      return (
        <I18nProvider namespaces={namespacesRequired}>
          <Page {...this.props} />
        </I18nProvider>
      );
    }
  };
};
