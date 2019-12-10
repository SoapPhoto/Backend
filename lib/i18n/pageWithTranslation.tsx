import React, { Component, ComponentType } from 'react';
import { flatten, uniq } from 'lodash';


import { ICustomNextContext } from '@lib/common/interfaces/global';
import { I18nNamespace } from './Namespace';

export const pageWithTranslation = (namespaces?: I18nNamespace | I18nNamespace[]) => <P extends {}>(
  // eslint-disable-next-line arrow-parens
  Page: ComponentType<P>,
) => {
  const defaultNamespaces = [I18nNamespace.Common, I18nNamespace.Backend, I18nNamespace.Validation];
  let namespacesRequired = [...defaultNamespaces];
  if (namespaces) {
    namespacesRequired = uniq([...flatten([namespaces]), ...defaultNamespaces]);
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
