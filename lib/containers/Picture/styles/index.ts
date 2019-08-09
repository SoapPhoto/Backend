import { rem } from 'polished';
import styled from 'styled-components';
import media from 'styled-media-query';

import { Image } from '@lib/components/Image';
import { A } from '@lib/components/A';

const padding = 24;

export const PictureContent = styled.div`
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

export const Wapper = styled.div`
  width: 100%;
  max-width: ${rem('1300px')};
  margin: ${rem(padding)} auto;
  padding: 0 ${rem('24px')};
`;

export const Col = styled.div<{col: number; ssr: boolean}>`
  display: ${_ => (_.ssr ? 'none' : 'grid')};
  grid-gap: ${rem(padding)};
  grid-template-columns: repeat(${props => props.col}, 1fr);
`;

export const ColItem = styled.div`
  &>div {
    margin-bottom: ${rem('24px')};
  }
  &:last-child {
    margin-bottom: ${rem('0px')};
  }
`;

export const ItemWapper = styled.div`
  position: relative;
  border-radius: ${rem('4px')};
  overflow: hidden;
  box-shadow: ${_ => _.theme.colors.shadowColor} ${rem('0px')} ${rem('6px')} ${rem('20px')};
  /* &:active {
    transform: scale(0.98);
    transition: transform 0.1s;
  } */
`;

export const ImageBox = styled.div<{height: number; background: string}>`
  position: relative;
  display: block;
  pointer-events: none;
  padding-bottom: ${props => props.height}%;
  background-color: ${props => props.background};
  width: 100%;
`;

export const ItemImage = styled(Image)`
  pointer-events: auto;
  position: absolute;
  top: 0;
  user-select: none;
  display: block;
  width: 100%;
  opacity: 0;
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
  padding: ${rem('8px')};
  height: ${rem('40px')};
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

export const UserBox = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  pointer-events: all;
`;

export const UserName = styled(A)`
  margin-left: ${rem('12px')};
  font-weight: 700;
  font-size: ${_ => rem(_.theme.fontSizes[1])};
  color: #fff;
  text-shadow: 0 0.0625rem 0.0625rem rgba(0,0,0,.3);
  &:active {
    transform: scale(0.96);
    transition: transform 0.1s;
  }
`;

export const HandleBox = styled.div`
  z-index: 3;
  & svg {
    filter: drop-shadow(0 0.0625rem 0.0625rem rgba(0,0,0,.3));
  }
`;

export const Footer = styled.div`
  text-align: center;
  height: ${rem('120px')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${_ => rem(_.theme.fontSizes[4])};
  color: ${_ => _.theme.colors.secondary};
  font-weight: 100;
`;
