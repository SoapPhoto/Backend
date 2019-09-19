import React from 'react';
import { rem } from 'polished';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import Head from 'next/head';
import styled, { css } from 'styled-components';

import { getTitle } from '@lib/common/utils';
import { href } from '@lib/common/utils/themes/common';
import { ArrowRight, CloudSnow } from '@lib/icon';
import { HttpStatus } from '@lib/common/enums/http';
import { theme } from '@lib/common/utils/themes';
import { IBaseScreenProps } from '@lib/common/interfaces/global';
import { I18nContext } from '@lib/i18n/I18nContext';

interface IErrorProps extends IBaseScreenProps {
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
  font-weight: 700;
  font-size: calc(4vw + 4vh + .5vmin);
`;

const Message = styled.p`
  font-weight: 700;
  font-size: calc(1vw + 1vh + .5vmin);
  margin-bottom: ${rem(12)};
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
  font-weight: 500;
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
    const { statusCode } = this.props;
    return {
      statusCode: statusCode || 500,
    };
  }

  public render() {
    const { statusCode } = this.error;
    return (
      <I18nContext.Consumer>
        {({ t }) => (
          <Wrapper>
            <Head>
              <title>{getTitle(String(statusCode), t)}</title>
            </Head>
            <Box>
              <CloudSnowIcon />
              <Status>{statusCode}</Status>
              {
                (statusCode === 500 || statusCode === 404) && (
                  <Message>{t(`error_message.${statusCode}`)}</Message>
                )
              }
              <A href="/">
                <span>{t('go_home')}</span>
                <ArrowRight
                  style={{ marginRight: rem(4) }}
                  size={14}
                />
              </A>
            </Box>
          </Wrapper>
        )}
      </I18nContext.Consumer>
    );
  }
}

export default Error;
