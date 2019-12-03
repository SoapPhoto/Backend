import { rem } from 'polished';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  margin-right: ${rem(24)};
  padding-bottom: ${rem(12)};
  margin-bottom: ${rem(12)};
`;

export const Box = styled.div`
  flex: 1;
`;

export const HandleBox = styled.div`
  display: flex;
  height: ${rem('36px')};
  margin-top: -${rem('48px')};
  padding: 0 ${rem('12px')};
  justify-content: space-between;
`;
