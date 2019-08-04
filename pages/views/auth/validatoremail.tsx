import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { ICustomNextContext } from '@lib/common/interfaces/global';

const Wrapper = styled.div`
  width: ${rem('700px')};
  margin: ${rem('42px')} auto;
  text-align: center;
`;

const Title = styled.div`
  font-size: ${_ => rem(_.theme.fontSizes[4])};
`;

const ValidatorEmail = () => (
  <Wrapper>
    <Title>验证成功</Title>
    <div>validatoremail</div>
  </Wrapper>
);

(ValidatorEmail as any).getInitialProps = async (ctx: ICustomNextContext) => {
  console.log(ctx.route.query);
  return {};
};

export default ValidatorEmail;
