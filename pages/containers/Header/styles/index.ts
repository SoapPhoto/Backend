import styled from 'styled-components';

export const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid rgb(238, 238, 238);
  box-shadow: rgba(0, 0, 0, 0.06) 0px 6px 20px;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 22px;
  font-size: 32px;
`;

export const MenuWapper = styled.nav`

`;

export const MenuItem = styled.nav`
  margin: 0 16px;
  font-size: 14px;
  color: #555;
`;

export const RightWarpper = styled.div`
  margin-right: 22px;
`;

export const LoginBtn = styled.a`
  text-decoration:none;
  color: #2628e1;
`;
