import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Popover } from '@lib/components/Popover';

interface IProps {
  popover?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Wrapper = styled(motion.button)`
  font-size: 0;
  outline: none;
  background: transparent;
  border: none;
  cursor: pointer;
  pointer-events: all;
`;

const template = ({ scale }: any) => `translate(0, 0) scale(${scale})`;

export const IconButton: React.FC<IProps> = ({
  onClick,
  popover,
  children,
}) => {
  const content = (
    <Wrapper
      transformTemplate={template}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      {children}
    </Wrapper>
  );
  if (popover) {
    return (
      <Popover
        trigger="hover"
        placement="top"
        theme="dark"
        openDelay={100}
        content={<span>{popover}</span>}
      >
        {content}
      </Popover>
    );
  }
  return content;
};
