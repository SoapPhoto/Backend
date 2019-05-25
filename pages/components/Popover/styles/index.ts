import styled from 'styled-components';

import { box } from '@pages/common/utils/themes/common';

export const Arrow = styled.span`
  position: absolute;
  z-index: 1;
  margin-left: 1px;
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  background-color: ${props => props.theme.styles.box.background};
  border: 1px solid ${props => props.theme.styles.box.borderColor};
  margin-top: -5px;
  border-right-color: transparent;
  border-bottom-color: transparent;
`;

export const Content = styled.div`
  ${props => box(props.theme, '100%', true)}
  padding: 0;
  box-shadow: ${_ => _.theme.colors.shadowColor} 0px 6px 32px 0px;
`;
