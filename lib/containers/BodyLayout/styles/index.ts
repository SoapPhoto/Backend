import styled from 'styled-components';
import { rem } from 'polished';

export const Wrapper = styled.div`
  position: relative;
  height: 100%;
  min-height: 100vh;
`;

export const Content = styled.div`
  height: 100%;
  min-height: calc(100vh - ${_ => rem(_.theme.height.header + _.theme.height.footer)} - 1px);
  padding-top: 0.5px;
  padding-bottom: 0.5px;
`;
