import React from 'react';
import { rem } from 'polished';
import { computed } from 'mobx';
import { observer, Provider } from 'mobx-react';
import Head from 'next/head';
import styled, { css } from 'styled-components';

import { getTitle } from '@lib/common/utils';
import { href } from '@lib/common/utils/themes/common';
import { ThemeWrapper } from '@lib/containers/Theme';
import { ArrowRight, CloudSnow } from '@lib/icon';
import { IMyMobxStore, initStore } from '@lib/stores/init';
import { HttpStatus } from '@lib/common/enums/http';
import { theme } from '@lib/common/utils/themes';

interface IErrorProps {
  statusCode: HttpStatus;
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
    stroke: ${theme('colors.primary')};
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
  public static getInitialProps: (data: any) => any;

  public mobxStore: IMyMobxStore;

  constructor(props: IErrorProps) {
    super(props);
    this.mobxStore = initStore({ screen: {} });
  }

  @computed get error() {
    const { statusCode } = this.props;
    return {
      statusCode: statusCode || 500,
    };
  }

  public render() {
    const { statusCode } = this.error;
    return (
      <Provider {...this.mobxStore}>
        <ThemeWrapper>
          <Wrapper>
            <Head>
              <title>{getTitle(String(statusCode))}</title>
            </Head>
            <Box>
              <CloudSnowIcon />
              <Status>{statusCode}</Status>
              <A href="/">
                  前往首页
                <ArrowRight
                  css={css`
                    margin-right: ${rem(4)};
                    width: 100%;
                  `}
                  size={14}
                />
              </A>
              {/* </Link> */}
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
