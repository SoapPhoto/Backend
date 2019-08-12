import React from 'react';

import { ICustomNextContext, IBaseScreenProps } from '@lib/common/interfaces/global';
import ErrorPage from '@pages/_error';
import { HttpStatus } from '@lib/common/enums/http';

// eslint-disable-next-line max-len
export const withError = <P extends IBaseScreenProps>(Component: React.ComponentType<P>) => class extends React.Component<P> {
  state = {
    hasError: false,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  }

  public static async getInitialProps(ctx: ICustomNextContext) {
    let props;
    if ((Component as any).getInitialProps) {
      props = await (Component as any).getInitialProps(ctx);
    }
    const error = {
      statusCode: ctx.res ? ctx.res.statusCode : undefined,
    };
    return { error, ...props };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  public render() {
    const { error } = this.props;
    const { hasError, statusCode } = this.state;
    if ((error && error.statusCode >= HttpStatus.BAD_REQUEST) || hasError) {
      return <ErrorPage statusCode={error ? error.statusCode : statusCode} />;
    }
    return <Component {...this.props} />;
  }
};
