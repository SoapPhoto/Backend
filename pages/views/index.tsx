import * as React from 'react';

interface InitialProps {
  query: any;
}

interface IProps extends InitialProps {}

class Index extends React.Component<IProps> {
  public static getInitialProps({ query }: InitialProps) {
    return { query };
  }

  public render() {
    const { query } = this.props;
    return (
      <div>
        {
          query.data.data.map(picture => (
            <div key={picture.id}>{picture.key}</div>
          ))
        }
      </div>
    );
  }
}

export default Index;
