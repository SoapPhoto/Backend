import { Provider, observer } from 'mobx-react';
import { NextContext } from 'next';
import * as React from 'react';
import styled from 'styled-components';

import { parsePath } from '@pages/common/utils';
import { ROUTE } from '@pages/common/utils/constants';
import { ThemeWrapper } from '@pages/containers/Theme';
import { initStore } from '@pages/stores/init';
import { Link } from '../components/router';
import { observable } from 'mobx';

interface InitialProps {
  query: any;
  url: any;
  list: any[];
}

interface IProps extends InitialProps {}

const Title = styled.h1`
  color: red;
  font-size: 20px;
`;

@observer
export default class Index extends React.Component<IProps> {
  public static getInitialProps({ asPath, query }: NextContext<any>) {
    const { data } = query;
    const router = parsePath(asPath);
    return {
      screenKey: ROUTE[router.pathname],
      picture: {
        key: ROUTE[router.pathname],
        list: data.data,
      },
    };
  }
  @observable public store: any = null;
  constructor(props: any) {
    super(props);
    console.log(this.props)
    this.store = initStore(this.props);
  }
  public render() {
    const { screenKey } = this.props;
    return (
      <Provider store={this.store}>
        <ThemeWrapper>
          <div>
            <h1>Hello Next.js 👋</h1>
            <Link to="test"><a>About</a></Link>
            {
              this.store[screenKey].list.map(picture => (
                <div key={picture.id}>{picture.key}</div>
              ))
            }
          </div>
        </ThemeWrapper>
      </Provider>
    );
  }
}
