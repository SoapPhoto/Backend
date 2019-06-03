import React from 'react';

import { CustomNextContext } from '@pages/common/interfaces/global';

interface IErrorProps {
  status: number;
}

class Error extends React.PureComponent<IErrorProps> {
  public static getInitialProps({ res, err }: CustomNextContext) {
    let statusCode = res ? res.statusCode : 500;
    console.log(statusCode, err);
    if (!(err instanceof Error) && err) {
      statusCode = err.statusCode;
    }
    return { status: statusCode };
  }

  public render() {
    return (
      <p>
        {this.props.status
          ? `An error ${this.props.status} occurred on server`
          : 'An error occurred on client'}
      </p>
    );
  }
}

export default Error;
