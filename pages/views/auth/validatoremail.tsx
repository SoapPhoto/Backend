import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { ICustomNextPage } from '@lib/common/interfaces/global';

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

const ValidatorEmail: ICustomNextPage<IProps, IProps> = ({ info }) => (
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

ValidatorEmail.getInitialProps = async ctx => ({
  info: ctx.query.info,
});

export default ValidatorEmail;
