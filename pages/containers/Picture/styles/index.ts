import styled from 'styled-components';
import media from 'styled-media-query';

const padding = 24;

export const Wapper = styled.section`
  width: 100%;
  max-width: 1300px;
  margin: ${padding}px auto;
  padding: 0 24px;


  ${media.lessThan('small')`
    &>div:nth-child(4) {
      display: grid;
    }
  `}

  ${media.between('small', 'medium')`
    &>div:nth-child(3) {
      display: grid;
    }
  `}

  ${media.between('medium', 'large')`
    &>div:nth-child(2) {
      display: grid;
    }
  `}

  ${media.greaterThan('large')`
    &>div:first-child {
      display: grid;
    }
  `}
`;

export const Col = styled.div<{col: number}>`
  display: none;
  grid-gap: ${padding}px;
  grid-template-columns: repeat(${props => props.col}, 1fr);
`;

export const ColItem = styled.div`
  &>div {
    margin-bottom: 24px;
  }
  &:last-child {
    margin-bottom: 0px;
  }
`;

export const ItemWapper = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: ${_ => _.theme.colors.shadowColor} 0px 6px 20px;
  &:active {
    transform: scale(0.98);
    transition: transform 0.1s;
  }
`;

export const ImageBox = styled.div<{height: number; background: string}>`
  position: relative;
  display: block;
  padding-bottom: ${props => props.height}%;
  background-color: ${props => props.background};
  width: 100%;
`;

export const ItemImage = styled.img`
  position: absolute;
  top: 0;
  user-select: none;
  pointer-events: none;
  display: block;
  width: 100%;
  transition: .2s opacity ease-in;
`;
