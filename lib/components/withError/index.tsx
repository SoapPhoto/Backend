import React from 'react';

import { ICustomNextContext, IBaseScreenProps } from '@lib/common/interfaces/global';
import ErrorPage from '@pages/_error';

// eslint-disable-next-line max-len
export const withError = <P extends IBaseScreenProps>(Component: React.ComponentType<P>) => class extends React.Component<P> {
  public static async getInitialProps(ctx: ICustomNextContext) {
    const props = await (Component as any).getInitialProps(ctx);
    return { statusCode: ctx.res ? ctx.res.statusCode : undefined, ...props };
  }

  public render() {
    const { statusCode, error } = this.props;
    if (
      (statusCode && statusCode !== 200)
        || (error && error.statusCode !== 200)
    ) {
      return <ErrorPage statusCode={error ? error.statusCode : statusCode} />;
    }
    return <Component {...this.props} />;
  }
};
