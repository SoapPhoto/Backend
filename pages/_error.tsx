import React from 'react';

import { computed } from 'mobx';
import { observer, Provider } from 'mobx-react';
import Head from 'next/Head';
import styled from 'styled-components';
import { href } from './common/utils/themes/common';
import { HeadTitle } from './components';
import { ThemeWrapper } from './containers/Theme';
import { ArrowRight, CloudSnow } from './icon';
import { Link } from './routes';
import { IMyMobxStore, initStore } from './stores/init';

interface IErrorProps {
  statusCode: number;
}

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

const Box = styled.div`
  text-align: center;
`;

const Status = styled.h2`
  font-weight: 300;
  font-size: calc(4vw + 4vh + .5vmin);
`;

const CloudSnowIcon = styled(CloudSnow)`
  width: calc(3vw + 3vh + .5vmin);
  height: calc(3vw + 3vh + .5vmin);
  & line {
    stroke: ${_ => _.theme.colors.primary};
  }
`;

const A = styled.a`
  ${_ => href(_.theme.colors.primary)}
  & svg {
    transition: .3s transform ease;
    transform: translate3d(0, 0, 0);
  }
  &:hover {
    svg {
      transform: translate3d(6px, 0, 0);
    }
  }
`;

@observer
class Error extends React.Component<IErrorProps> {
  @computed get error() {
    return {
      statusCode: this.props.statusCode || 500,
    };
  }
  public static getInitialProps: (data: any) => any;
  public mobxStore: IMyMobxStore;
  constructor(props: IErrorProps) {
    super(props);
    this.mobxStore = initStore({ screen: {} });
  }

  public render() {
    const { statusCode } = this.error;
    return (
      <Provider {...this.mobxStore}>
        <ThemeWrapper>
          <Wrapper>
            <Head>
              <HeadTitle>{statusCode}</HeadTitle>
            </Head>
            <Box>
              <CloudSnowIcon />
              <Status>{statusCode}</Status>
              <Link route="/">
                <A href="/">
                  前往首页
                  <ArrowRight style={{ marginLeft: 4 }} size={14} />
                </A>
              </Link>
            </Box>
          </Wrapper>
        </ThemeWrapper>
      </Provider>
    );
  }
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode };
};

export default Error;
