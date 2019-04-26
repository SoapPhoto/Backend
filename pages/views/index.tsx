import BaseLink from 'next/link';
import * as React from 'react';
import styled from 'styled-components';

import { ThemeWrapper } from '@pages/containers/Theme';
import { Link } from '../components/router';

interface InitialProps {
  query: any;
  list: any[];
}

interface IProps extends InitialProps {}

const Title = styled.h1`
  color: red;
  font-size: 20px;
`;

export default class Index extends React.Component<IProps> {
  public static getInitialProps({ query }: InitialProps) {
    const { data } = query;
    return { list: data.data };
  }
  public componentDidMount() {
    console.log(this.props);
  }
  public render() {
    return (
      <ThemeWrapper>
        <div>
          <h1>Hello Next.js 👋</h1>
          <Link to="test"><a>About</a></Link>
          {
            this.props.list.map(picture => (
              <BaseLink key={picture.id} href={'views/picture'} as={`picture/${picture.id}`}>
                <Title>{picture.key}</Title>
              </BaseLink>
            ))
          }
        </div>
      </ThemeWrapper>
    );
  }
}
