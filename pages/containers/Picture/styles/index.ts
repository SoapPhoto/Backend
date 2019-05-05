import styled from 'styled-components';

const padding = 24;

export const Wapper = styled.section`
  width: 100%;
  max-width: 1800px;
  margin: ${padding}px auto;
`;

export const Col = styled.div<{col: number}>`
  display: grid;
  grid-gap: ${padding}px;
  grid-template-columns: repeat(${props => props.col}, 1fr);
`;

export const ColItem = styled.div`
  display: grid;
  grid-row-gap: 24px;
  grid-template-rows: max-content;
`;

export const ItemWapper = styled.div`
  position: relative;
  &:active {
    transform: scale(0.98);
    transition: transform 0.1s;
  }
`;

export const ImageBox = styled.div<{height: number; background: string}>`
  display: block;
  padding-bottom: ${props => props.height}%;
  background-color: ${props => props.background};
  width: 100%;
  overflow: hidden;
`;

export const ItemImage = styled.img`
  position: absolute;
  top: 0;
  display: block;
  border-radius: 4px;
  width: 100%;
`;
