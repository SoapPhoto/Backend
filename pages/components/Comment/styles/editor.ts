import { rem } from 'polished';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: ${rem('18px')};
  margin-bottom: ${rem('36px')};
`;

export const HandleBox = styled.div`
  display: flex;
  height: ${rem('36px')};
  margin-top: -${rem('48px')};
  padding: 0 ${rem('12px')};
  justify-content: space-between;
`;
