import { flatten } from 'lodash';
import React, { Component, ComponentType } from 'react';


import { ICustomNextContext } from '@lib/common/interfaces/global';
import { I18nNamespace } from './Namespace';

export const pageWithTranslation = (namespaces?: I18nNamespace | I18nNamespace[]) => <P extends {}>(
  // eslint-disable-next-line arrow-parens
  Page: ComponentType<P>,
) => {
  let namespacesRequired = [I18nNamespace.Common];
  if (namespaces) {
    namespacesRequired = [...flatten([namespaces]), I18nNamespace.Common];
  }

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
        <Page {...this.props} />
      );
    }
  };
};
