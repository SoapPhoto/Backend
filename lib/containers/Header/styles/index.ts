import styled from 'styled-components';

import { href } from '@lib/common/utils/themes/common';
import { rem } from 'polished';
import { A } from '@lib/components/A';
import { theme } from '@lib/common/utils/themes';

export const Wrapper = styled.header<{login: boolean}>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: ${rem('80px')};
  align-items: center;
  background: ${_ => (_.login ? 'transparent' : _.theme.layout.header.background)};
  border-bottom-color: ${theme('layout.header.borderColor')};
  border-bottom-style: solid;
  border-bottom-width: ${_ => (_.login ? 0 : 1)}px;
  box-shadow:
    ${_ => (_.login ? 'transparent' : _.theme.layout.header.shadowColor)} ${rem('0px')} ${rem('6px')} ${rem('20px')};
  transition: .2s all ease;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${rem('22px')};
  font-size: ${_ => rem(_.theme.fontSizes[5])};
`;

export const MenuWapper = styled.nav`

`;

export const RightWarpper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: ${rem('22px')};
`;

export const Href = styled(A)`
  ${_ => href(_.theme.styles.link.color)}
`;

export const MenuProfile = styled.div`
  display: flex;
`;

export const UserName = styled.div`
  display: flex;
  font-size: ${theme('fontSizes[2]')};
  margin-left: ${rem('12px')};
  flex-direction: column;
  justify-content: center;
`;
