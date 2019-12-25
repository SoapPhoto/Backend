import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Popover } from '@lib/components/Popover';

interface IProps {
  popover?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const IconButtonStyled = styled(motion.button)`
  font-size: 0;
  outline: none;
  background: transparent;
  border: none;
  cursor: pointer;
  pointer-events: all;
  :disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const template = ({ scale }: any) => `translate(0, 0) scale(${scale})`;

export const IconButton: React.FC<IProps> = ({
  onClick,
  popover,
  children,
  ...props
}) => {
  const content = (
    <IconButtonStyled
      transformTemplate={template}
      whileHover={{ scale: props.disabled ? 1 : 1.1 }}
      whileTap={{ scale: props.disabled ? 1 : 0.9 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </IconButtonStyled>
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
