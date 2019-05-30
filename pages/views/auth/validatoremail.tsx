import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: ${rem('700px')};
  margin: ${rem('42px')} auto;
  text-align: center;
`;

const Title = styled.div`
  font-size: ${_ => rem(_.theme.fontSizes[4])};
`;

export default () => {
  return (
    <Wrapper>
      <Title>验证成功</Title>
      <div>validatoremail</div>
    </Wrapper>
  );
};
