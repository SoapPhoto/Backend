import styled from 'styled-components';

export const Wapper = styled.section`
  margin: 24px 42px;
`;

export const Col = styled.div<{col: number}>`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(${props => props.col}, 1fr);
`;

export const ItemWapper = styled.div`
`;

export const ImageBox = styled.div`
  display: block;
  width: 100%;
  border: 1px solid #f0f0f0 ;
  box-shadow: 0 30px 100px 5px #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

export const ItemImage = styled.img`
  display: block;
  width: 100%;
`;
