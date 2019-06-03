import React from 'react';

import { Provider } from 'mobx-react';
import styled from 'styled-components';
import { ThemeWrapper } from './containers/Theme';
import { IMyMobxStore, initStore } from './stores/init';

interface IErrorProps {
  status: number;
}

const Wrapper = styled.section`
  width: 100%;
  height: 100vh;
`;

class Error extends React.Component<IErrorProps> {
  public mobxStore: IMyMobxStore;
  constructor(props: IErrorProps) {
    super(props);
    this.mobxStore = initStore({ screen: {} });
  }

  public render() {
    return (
      <Provider {...this.mobxStore}>
        <ThemeWrapper>
          <Wrapper>
            {
              this.props.status &&
              <h2>{this.props.status}</h2>
            }
            {this.props.status
              ? `An error ${this.props.status} occurred on server`
              : 'An error occurrssssssed on client'}
          </Wrapper>
        </ThemeWrapper>
      </Provider>
    );
  }
}

export default Error;
