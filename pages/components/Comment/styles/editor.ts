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
  justify-content: space-between;
  margin-top: ${rem('14px')};
`;
