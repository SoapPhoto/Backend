import styled from 'styled-components';

export const Wapper = styled.section`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 24px;
  margin: 24px 42px;
`;

export const ItemWapper = styled.div`
  position: relative;
`;

export const ImageBox = styled.div`
  position: absolute;
  padding-top: 100%;
  display: block;
  width: 100%;
  height: 100%;
`;

export const ItemImage = styled.div<{background: string}>`
  position: absolute;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid #f0f0f0 ;
  box-shadow: 0 30px 100px 5px #f0f0f0;
  border-radius: 4px;
  background-size: cover;
  background-image: url(${props => props.background});
`;
