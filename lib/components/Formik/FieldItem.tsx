import React from 'react';
import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { isFunction } from 'lodash';
import { motion } from 'framer-motion';

import { theme } from '@lib/common/utils/themes';

export interface IFieldItemProps {
  label: string;
  bio?: string;
  onClick?: () => void;
}

const OFFSET = 12;

const Content = styled(motion.div)<{isClicked: number}>`
  z-index: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &::before {
    content: '';
    z-index: -1;
    position: absolute;
    top: -${rem(OFFSET)};
    left: -${rem(OFFSET)};
    width: calc(100% + ${rem(OFFSET * 2)});
    height: calc(100% + ${rem(OFFSET * 2)});
    background: transparent;
    transform: scale(0.9);
    border-radius: 6px;
    transition: .2s all ease;
  }
  ${_ => (_.isClicked ? css`
    cursor: pointer;
    &:hover {
      &::before {
        transform: scale(1);
        background: ${theme('layout.header.menu.hover.background')};
      }
    }
  ` : '')}
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Label = styled.p`
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  color: ${theme('colors.text')};
  margin: 0;
`;
const Bio = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  color: ${theme('colors.secondary')};
  margin-top: ${rem(4)};
`;

const template = ({ scale }: any) => `translate(0, 0) scale(${scale})`;

export const FieldItem: React.FC<IFieldItemProps> = ({
  label, bio, children, onClick,
}) => {
  const isClicked = isFunction(onClick);
  return (
    <Content
      transformTemplate={template}
      whileHover={{ scale: 1 }}
      whileTap={{ scale: isClicked ? 0.98 : 1 }}
      isClicked={isClicked ? 1 : 0}
      onClick={onClick}
    >
      <Box>
        <Label>
          {label}
        </Label>
        {
          bio && (
            <Bio>
              {bio}
            </Bio>
          )
        }
      </Box>
      {children}
    </Content>
  );
};
