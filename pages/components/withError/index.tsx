import React, { Props, ReactNode } from 'react';

import ErrorPage from '@pages/_error';
import { CustomNextContext, IBaseScreenProps } from '@pages/common/interfaces/global';

export const withError = <P extends IBaseScreenProps>(Component: React.ComponentType<P>) =>
  class extends React.Component<P> {
    public static async getInitialProps(ctx: CustomNextContext) {
      const props = await (Component as any).getInitialProps(ctx);
      return { statusCode: ctx.res ? ctx.res.statusCode : undefined, ...props };
    }

    public render() {
      const { statusCode, error } = this.props;
      if (
        statusCode && statusCode !== 200 ||
        error && error.statusCode !== 200
      ) {
        return <ErrorPage statusCode={error ? error.statusCode : statusCode} />;
      }
      return <Component {...this.props} />;
    }
  };