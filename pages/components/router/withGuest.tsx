import { CustomNextContext } from '@pages/common/interfaces/global';
import { inject, observer } from 'mobx-react';
import { NextComponentClass } from 'next';
import * as React from 'react';

type component<P> = React.ComponentClass<P> | React.SFC<P>;

const getDisplayName = <P extends object>(Component: component<P>) =>
  Component.displayName || Component.name || 'Component';

export const withAuth = <P extends object>(WrappedComponent: component<P>, role?: string) =>
  class extends React.Component<P> {
    public static displayName = `withAuthSync(${getDisplayName<P>(WrappedComponent)})`;

    public static async getInitialProps (ctx: CustomNextContext) {
      const componentProps =
        (WrappedComponent as NextComponentClass).getInitialProps &&
        (await (WrappedComponent as NextComponentClass).getInitialProps!(ctx));

      return { ...componentProps };
    }
    public render () {
      return <WrappedComponent {...this.props} />;
    }
  };
