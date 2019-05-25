import { Placement } from 'popper.js';
import styled from 'styled-components';

import { box } from '@pages/common/utils/themes/common';

const placementSize: any = {
  top: 'bottom: -4px;',
  bottom: 'top: -4px;',
};

export const Arrow = styled.span<{placement: Placement}>`
  position: absolute;
  z-index: 999;
  margin-left: 1px;
  width: 10px;
  height: 10px;
  ${_ => placementSize[_.placement]}
  transform: rotate(45deg);
  background-color: ${_ => _.theme.styles.box.background};
  border: 1px solid ${_ => _.theme.styles.box.borderColor};
  border-top-color: ${_ => _.placement === 'bottom' ? _.theme.styles.box.borderColor : 'transparent'};
  border-left-color: ${_ => _.placement === 'bottom' ? _.theme.styles.box.borderColor : 'transparent'};
  border-right-color: ${_ => _.placement === 'top' ? _.theme.styles.box.borderColor : 'transparent'};
  border-bottom-color: ${_ => _.placement === 'top' ? _.theme.styles.box.borderColor : 'transparent'};
`;

export const Content = styled.div`
  ${props => box(props.theme, '100%', true)}
  z-index: 999;
  padding: 4px 12px;
  box-shadow: ${_ => _.theme.colors.shadowColor} 0px 6px 32px 0px;
`;
