import styled from 'styled-components';

const padding = 24;

export const Wapper = styled.section`
  margin: ${padding}px 42px;
`;

export const Col = styled.div<{col: number}>`
  display: grid;
  grid-gap: ${padding}px;
  grid-template-columns: repeat(${props => props.col}, 1fr);
`;

export const ColItem = styled.div`
  display: grid;
  grid-row-gap: 24px;
  grid-template-rows: auto;
`;

export const ItemWapper = styled.div`
  position: relative;
`;

export const ImageBox = styled.div<{height: number; background: string}>`
  display: block;
  padding-bottom: ${props => props.height}%;
  background-color: ${props => props.background};
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

export const ItemImage = styled.img`
  position: absolute;
  top: 0;
  display: block;
  width: 100%;
`;
