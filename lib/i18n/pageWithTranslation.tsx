import React, { ComponentType } from 'react';
import { flatten, uniq } from 'lodash';


import { ICustomNextContext, ICustomNextPage } from '@lib/common/interfaces/global';
import { I18nNamespace } from './Namespace';

export const pageWithTranslation = (namespaces?: I18nNamespace | I18nNamespace[]) => <P extends {}>(
  // eslint-disable-next-line arrow-parens
  Page: ComponentType<P>,
) => {
  let namespacesRequired: I18nNamespace[] = [];
  if (namespaces) {
    namespacesRequired = uniq([...flatten([namespaces])]);
  }

  const PageScreen: ICustomNextPage<any> = props => (
    <Page {...props as any} />
  );

  PageScreen.getInitialProps = async (appContext: ICustomNextContext) => {
    let appProps = {};
    if (typeof (Page as any).getInitialProps === 'function') {
      appProps = await (Page as any).getInitialProps(appContext);
    }
    return {
      ...appProps,
      namespacesRequired,
    };
  };
  return PageScreen;
};
