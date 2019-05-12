import styled from 'styled-components';

import { href } from '@pages/common/utils/themes/common';

export const Wrapper = styled.header<{login: boolean}>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  align-items: center;
  background: ${_ => _.login ? 'transparent' :_.theme.header.background};
  border-bottom-color: ${_ => _.theme.header.borderColor};
  border-bottom-style: solid;
  border-bottom-width: ${_ => _.login ? 0 : 1}px;
  box-shadow: ${_ => _.login ? 'transparent' : _.theme.header.shadowColor} 0px 6px 20px;
  transition: .2s all ease;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 22px;
  font-size: 32px;
`;

export const MenuWapper = styled.nav`

`;

export const RightWarpper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-right: 22px;
`;

export const Href = styled.a`
  ${_ => href(_.theme.link.color)}
`;

export const MenuProfile = styled.div`
  display: flex;
`;

export const UserName = styled.div`
  display: flex;
  font-size: 16px;
  margin-left: 12px;
  flex-direction: column;
  justify-content: center;
`;
