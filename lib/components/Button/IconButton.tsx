import React from 'react';
import { Popover } from '@lib/components/Popover';
import styled from 'styled-components';
import { activte } from '@lib/common/utils/themes';

interface IProps {
  popover?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Wrapper = styled.div`
  font-size: 0;
  cursor: pointer;
  & svg {
    cursor: pointer;
    user-select: none;
    transition: transform 0.1s;
    ${activte(0.7)}
  }
`;

export const IconButton: React.FC<IProps> = ({
  onClick,
  popover,
  children,
}) => (
  <Popover
    trigger="hover"
    placement="top"
    theme="dark"
    openDelay={100}
    content={<span>{popover}</span>}
  >
    <Wrapper
      onClick={onClick}
    >
      {children}
    </Wrapper>
  </Popover>
);
