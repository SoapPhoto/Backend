import { rem, cover } from 'polished';
import styled from 'styled-components';

import { Image } from '@lib/components/Image';
import { A } from '@lib/components/A';
import { WrapperBox } from '@lib/common/utils/themes/common';
import { theme, activte } from '@lib/common/utils/themes';
import { customMedia } from '@lib/common/utils/mediaQuery';

const padding = 30;

export const PictureContent = styled.div`
  ${customMedia.lessThan('mobile')`
    &>div:nth-child(4) {
      display: grid;
    }
  `}

  ${customMedia.between('mobile', 'medium')`
    &>div:nth-child(3) {
      display: grid;
    }
  `}

  ${customMedia.between('medium', 'large')`
    &>div:nth-child(2) {
      display: grid;
    }
  `}

  ${customMedia.greaterThan('large')`
    &>div:first-child {
      display: grid;
    }
  `}
`;

export const Wrapper = styled.div`
  ${WrapperBox()}
`;

export const Col = styled.div<{col: number; ssr: boolean}>`
  display: ${_ => (_.ssr ? 'none' : 'grid')};
  grid-gap: ${rem(padding)};
  grid-template-columns: repeat(${props => props.col}, 1fr);
`;

export const ColItem = styled.div`
  &>div {
    margin-bottom: ${rem(padding)};
  }
  &:last-child {
    margin-bottom: ${rem('0px')};
  }
`;

export const ItemWapper = styled.div`
  position: relative;
  border-radius: ${rem('4px')};
  overflow: hidden;
  box-shadow: ${theme('colors.shadowColor')} ${rem('0px')} ${rem('6px')} ${rem('20px')};
  /* &:active {
    transform: scale(0.98);
    transition: transform 0.1s;
  } */
`;

export const Link = styled(A)`
  ${cover()}
  z-index: 2;
`;

export const ImageBox = styled.div<{height: number; background: string}>`
  position: relative;
  display: block;
  pointer-events: none;
  padding-bottom: ${props => props.height}%;
  background-color: ${props => props.background};
  width: 100%;
  transition: .2s filter ease-in-out;
  /* ${ItemWapper}:hover & {
    filter: blur(2px);
  } */
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
  align-items: center;
  justify-content: space-between;
  bottom: 0;
  padding: ${rem('12px')} ${rem('14px')};
  padding-top: ${rem(16)};
  width: 100%;
  background: linear-gradient(180deg,transparent 0,rgba(0,0,0,.6) 81%);
  opacity: 0;
  /* transform: translate3d(0, 20px, 0); */
  transition: .2s opacity ease-in-out;
  ${customMedia.lessThan('medium')`
    opacity: 1;
    /* transform: translate3d(0, 0, 0); */
  `}
  ${ItemWapper}:hover & {
    opacity: 1;
    /* transform: translate3d(0, 0, 0); */
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
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  color: #fff;
  text-shadow: 0 0.0625rem 0.0625rem rgba(0,0,0,.3);
  ${activte()}
`;

export const HandleBox = styled.div`
  display: flex;
  align-items: center;
  & svg {
    filter: drop-shadow(0 0.0625rem 0.0625rem rgba(0,0,0,.3));
  }
`;

export const LockIcon = styled.div`
  position: absolute;
  z-index: 2;
  background: #ccc;
  right: ${rem(6)};
  top: ${rem(6)};
  background: #000;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Footer = styled.div`
  text-align: center;
  height: ${rem('120px')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${_ => rem(_.theme.fontSizes[4])};
  color: ${theme('colors.secondary')};
  font-weight: 100;
`;
