import React from 'react';

const DefaultOnSSR = () => (<span/>);

interface INoSSRProps {
  /**
   * 为`true`服务器不渲染，为`false`浏览器不渲染
   *
   * @type {boolean}
   * @memberof INoSSRProps
   */
  server: boolean;
  onSSR: React.ReactElement;
}

interface INoSSRState {
  canRender: boolean;
}

export class NoSSR extends React.PureComponent<INoSSRProps, INoSSRState> {
  public static defaultProps: Partial<INoSSRProps> = {
    onSSR: <DefaultOnSSR />,
    server: true,
  };
  public state = {
    canRender: !this.props.server,
  };

  public componentDidMount() {
    this.setState(state => ({ canRender: !state.canRender }));
  }

  public render() {
    const { children, onSSR } = this.props;
    const { canRender } = this.state;
    return canRender ? children : onSSR;
  }
}
