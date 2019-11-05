import React, { useEffect } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { Router } from '@lib/routes';
import { box } from '@lib/common/utils/themes/common';
import { A } from '@lib/components/A';

interface IProps {
  title: string;
  message?: React.ReactElement;
  tips?: React.ReactElement;
  back?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  margin-bottom: ${rem(24)};
  font-weight: 400;
  font-size: ${_ => rem(_.theme.fontSizes[4])};
`;

const Box = styled.div`
  ${props => box(props.theme, '380px', true)}
`;

const Message = styled.p``;

const Tips = styled.p`
  margin-top: ${rem(12)};
`;

const Back = styled.div`
  margin-top: ${rem(24)};
`;


export const MessagePage: React.FC<IProps> = ({
  title, back = true, message,
}) => {
  useEffect(() => {
    Router.events.on('routeChangeStart', (data) => {
      window.location.href = data;
    });
  }, []);
  return (
    <Wrapper>
      <Box>
        <Title>{ title }</Title>
        {
          message && (
            <Message>
              {message}
            </Message>
          )
        }
        {
          back && (
            <Back>
              <A route="/login">返回登录</A>
            </Back>
          )
        }
      </Box>
    </Wrapper>
  );
};
