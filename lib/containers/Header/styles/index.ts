import styled from 'styled-components';
import { motion } from 'framer-motion';

import { href } from '@lib/common/utils/themes/common';
import { rem, rgba } from 'polished';
import { A } from '@lib/components/A';
import { theme } from '@lib/common/utils/themes';
import { IconButton } from '@lib/components/Button';
import { ChristmasHat } from '@lib/icon/ChristmasHat';
import { Search } from 'react-feather';

export const verifyHeight = 35;

export const Wrapper = styled.header<{login: boolean}>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: ${_ => rem(theme('height.header')(_))};
  align-items: center;
  background: ${_ => (_.login ? 'transparent' : _.theme.layout.header.background)};
  border-bottom-color: ${theme('layout.header.borderColor')};
  border-bottom-style: solid;
  border-bottom-width: ${_ => (_.login ? 0 : _.theme.layout.header.borderWidth)}px;
  box-shadow: inset 0px -1px 0px
    ${_ => (_.login ? 'transparent' : _.theme.layout.header.shadowColor)};
  transition: .2s all ease;
  ${_ => !_.login && `
    @supports (backdrop-filter: saturate(180%) blur(20px)) {
      background-color: ${rgba(_.theme.layout.header.background, 0.9)};
      & { backdrop-filter: saturate(180%) blur(20px); }
    }
    position: fixed;
    top: 0;
    z-index: 100;
  `}
`;

export const Logo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: ${rem('22px')};
  font-size: ${_ => rem(_.theme.fontSizes[5])};
`;

export const Christmas = styled(ChristmasHat)`
  position: absolute;
  top: -6px;
  left: -2px;
  transform:rotate(-40deg);
`;

export const MenuWrapper = styled.nav`

`;

export const RightWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: ${rem('22px')};
`;

export const Href = styled(A)`
  ${_ => href(_.theme.colors.primary)}
`;

export const MenuProfile = styled.div`
  display: flex;
`;

export const UserName = styled.div`
  display: flex;
  font-size: ${_ => rem(theme('fontSizes[2]')(_))};
  margin-left: ${rem('12px')};
  flex-direction: column;
  justify-content: center;
`;

export const VerifyMessage = styled(motion.div)`
  overflow: hidden;
  position: fixed;
  top: 0;
  z-index: 101;
  width: 100%;
  background: #000;
  color: #fff;
  height: ${rem(verifyHeight)};
  line-height: ${rem(verifyHeight)};
  text-align: center;
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
`;

export const Again = styled.button`
  margin: 0;
  padding: 0;
  outline: 0;
  border: none;
  background: none;
  color: ${theme('colors.primary')};
  cursor: pointer;
`;

export const Close = styled(IconButton)`
  position: absolute;
  right: ${rem(12)};
  top: ${rem(5)};
  color: #fff;
  width: ${rem(20)};
  height: ${rem(20)};
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchIcon = styled(Search)`
  color: ${theme('colors.text')};
`;

export const Block = styled.div<{isVerifyMessage: number}>`
  height: ${_ => rem(theme('height.header')(_) + (_.isVerifyMessage ? verifyHeight : 0))};
  transition: 0.3s height ease;
`;
