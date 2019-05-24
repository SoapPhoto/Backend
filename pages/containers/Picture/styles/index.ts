import { Heart } from '@pages/icon';
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

export const InfoBox = styled.div`
  z-index: 3;
  pointer-events: none;
  position: absolute;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  bottom: 0;
  padding: 8px;
  height: 40px;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .2));
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  transition: .2s opacity ease, .2s transform ease;
  ${ItemWapper}:hover & {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const UserBox = styled.a`
  display: flex;
  align-items: center;
  color: #fff;
  text-decoration: none;
  pointer-events: all;
`;

export const UserName = styled.span`
  margin-left: 12px;
  font-weight: 700;
  font-size: 14px;
  text-shadow: 0 0.0625rem 0.0625rem rgba(0,0,0,.3);
`;

export const HandleBox = styled.div`
  z-index: 3;
  pointer-events: all;
  & svg {
    filter: drop-shadow(0 0.0625rem 0.0625rem rgba(0,0,0,.3));
  }
`;

export const LikeButton = styled(Heart)<{isLike: boolean}>`
  cursor: pointer;
  transition: .2s fill ease, .2s stroke ease;
  fill: ${_ => _.isLike ? 'red' : 'none'};
  stroke: ${_ => _.isLike ? 'red' : '#fff'};
`;
