import { rem } from 'polished';
import React, { useEffect } from 'react';
import Router from 'next/router';
import styled from 'styled-components';

import { ICustomNextPage } from '@lib/common/interfaces/global';
import { validatorEmail } from '@lib/services/auth';

const Wrapper = styled.div`
  width: ${rem('700px')};
  margin: ${rem('42px')} auto;
  text-align: center;
`;

const Title = styled.div`
  font-size: ${_ => rem(_.theme.fontSizes[4])};
`;

interface IProps {
  info?: {
    statusCode: number;
    message: string;
  };
}

const ValidatorEmail: ICustomNextPage<IProps, IProps> = ({ info }) => {
  useEffect(() => {
    Router.events.on('routeChangeStart', (data) => {
      window.location.href = data;
    });
  }, []);
  return (
    <Wrapper>
      {
        info ? (
          <Title>{info.message}</Title>
        ) : (
          <Title>验证成功</Title>
        )
      }
    </Wrapper>
  );
};

ValidatorEmail.getInitialProps = async (ctx: any) => {
  try {
    await validatorEmail(ctx.query);
    return {};
  } catch (err) {
    return { info: err.response.data };
  }
};

export default ValidatorEmail;
