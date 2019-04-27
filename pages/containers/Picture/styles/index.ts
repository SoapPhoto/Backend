import styled from 'styled-components';

export const Wapper = styled.section`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 24px;
  margin: 24px 42px;
`;

export const ItemWapper = styled.div`
  border: 1px solid #f0f0f0 ;
  box-shadow: 0 30px 100px 5px #f0f0f0;
`;

export const ItemImage = styled.div<any>`
  display: block;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-image: url(${props => props.background});
`;
