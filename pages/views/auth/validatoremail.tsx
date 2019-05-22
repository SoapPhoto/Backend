import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 700px;
  margin: 42px auto;
  text-align: center;
`;

const Title = styled.div`
  font-size: 2.4em;
`;

export default () => {
  return (
    <Wrapper>
      <Title>验证成功</Title>
      <div>validatoremail</div>
    </Wrapper>
  );
};
