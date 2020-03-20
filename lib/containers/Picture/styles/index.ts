import { rem, cover, rgba } from 'polished';
import styled, { css } from 'styled-components';

import { Image } from '@lib/components/Image';
import { A } from '@lib/components/A';
import { WrapperBox } from '@lib/common/utils/themes/common';
import {
  theme, initButton, activate, skeletonCss,
} from '@lib/common/utils/themes';
import { customMedia } from '@lib/common/utils/mediaQuery';
import { Heart } from '@lib/icon';
import { motion } from 'framer-motion';

const padding = 30;

export const ItemImage = styled(Image)`
  pointer-events: auto;
  position: absolute;
  top: 0;
  user-select: none;
  display: block;
  width: 100%;
  opacity: 0;
  transition: .2s opacity ease-in;
  z-index: 1;
  border-radius: 4px;
`;

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

export const ItemWrapper = styled.div<{private: number}>`
  position: relative;
  border-radius: ${rem('4px')};
  box-shadow: ${theme('colors.shadowColor')} ${rem('0px')} ${rem('6px')} ${rem('20px')};
  ${_ => (_.private ? css`
    &:hover {
      ${ItemImage} {
        filter: blur(0px);
      }
    }
    ${ItemImage} {
      ${customMedia.lessThan('medium')`
        filter: blur(0px);
      `}
      filter: blur(12px);
    }
  ` : '')}
  /* &:active {
    transform: scale(0.98);
    transition: transform 0.1s;
  } */
`;

const handleHover = css`
  opacity: 0;
  transition: .2s opacity ease-in-out;
  ${customMedia.lessThan('mobile')`
    opacity: 1;
  `}
  ${_ => (_.theme.isMobile ? css`
    opacity: 1;
  ` : css``)}
  ${ItemWrapper}:hover & {
    opacity: 1;
  }
`;

export const Link = styled(A)`
  ${cover()}
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    overflow: hidden;
    bottom: 0;
    left: 0;
    right: 0;
    height: 220px;
    pointer-events: none;
    border-radius: 4px;
    background: linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%);
    ${handleHover}
  }
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
  border-radius: 4px;
  /* ${ItemWrapper}:hover & {
    filter: blur(2px);
  } */
`;

export const InfoBox = styled.div`
  z-index: 3;
  pointer-events: none;
  position: absolute;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  bottom: 0;
  padding: ${rem('12px')} ${rem('14px')};
  padding-top: ${rem(16)};
  width: 100%;
  /* background: linear-gradient(180deg,transparent 0,rgba(0,0,0,.6) 81%); */
  ${handleHover}
`;

export const UserBox = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  pointer-events: all;
`;

export const UserName = styled(A)`
  text-decoration: none;
  margin-left: ${rem('12px')};
  font-weight: 600;
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  color: #fff;
  text-shadow: 0 0.0625rem 0.0625rem rgba(0,0,0,.3);
  ${activate()}
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
  top: ${rem(12)};
  left: ${rem(12)};
  background: rgba(0, 0, 0, .8);
  border-radius: 50%;
  width: ${rem(30)};
  height: ${rem(30)};
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

export const LikeContent = styled(motion.button)`
  ${initButton}
  z-index: 3;
  position: absolute;
  top: ${rem(12)};
  right: ${rem(12)};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${_ => rgba(_.theme.colors.pure, 0.8)};
  padding: ${rem(4)} ${rem(14)};
  font-family: Rubik;
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  border: none;
  border-radius: 20px;
  line-height: 20px;
  font-weight: 600;
  color: ${theme('colors.text')};
  ${handleHover}
`;

export const HeartIcon = styled(Heart)<{islike: number}>`
  stroke-width: 3px;
  stroke: ${theme('colors.danger')};
  fill: ${_ => (_.islike ? _.theme.colors.danger : 'none')};
  stroke: ${_ => (_.islike ? _.theme.colors.danger : _.color || '#fff')};
  margin-right: ${rem(4)};
`;

export const Shadow = styled.div`
  position: absolute;
  height: 10%;
  width: 90%;
  left: 5%;
  bottom: 2px;
  background-position-y: 100%;
  filter: blur(10px);
  z-index: 0;
  opacity: ${theme('styles.picture.shadow.opacity')};
`;

export const ImgBox = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const SkeletonContent = styled.div`
  display: grid;
  grid-gap: ${rem(24)};
  ${customMedia.lessThan('mobile')`
    grid-template-columns: repeat(1, 1fr);
  `}

  ${customMedia.between('mobile', 'medium')`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${customMedia.between('medium', 'large')`
    grid-template-columns: repeat(3, 1fr);
  `}

  ${customMedia.greaterThan('large')`
    grid-template-columns: repeat(4, 1fr);
  `}
`;

export const SkeletonItem = styled.picture`
  position: relative;
  height: ${rem(210)};
  border-radius: 4px;
  background: ${theme('styles.box.background')};
  box-shadow: 0 5px 10px ${theme('colors.shadowColor')};
`;

export const SkeletonAvatar = styled.div`
  width: ${rem(32)};
  height: ${rem(32)};
  border-radius: 50%;
  position: absolute;
  bottom: ${rem(12)};
  left: ${rem(12)};
  ${skeletonCss}
`;

export const SkeletonName = styled.div`
  width: ${rem(80)};
  height: ${rem(12)};
  border-radius: 4px;
  position: absolute;
  bottom: ${rem(21)};
  left: ${rem(50)};
  ${skeletonCss}
`;
