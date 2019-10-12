import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'react-feather';
import styled, { css } from 'styled-components';

import { enableScroll, disableScroll, server } from '@lib/common/utils';
import { IconButton } from '../Button';
import { NoSSR } from '../SSR';

interface IProps {
  visible: boolean;
  onClose: () => void;
  src: string;
}

const Wrapper = styled(motion.div)`
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  width: 100vw;
  height: 100vh;
  color: #fff;
`;

const Box = styled.div<{big: number}>`
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  overflow: auto;
  ${_ => (_.big ? css`
    align-items: baseline;
  ` : css`
    align-items: center;
  `)}
`;

const CloseBtn = styled(IconButton)`
  position: fixed;
  right: 24px;
  top: 24px;
  width: 32px;
  height: 32px;
  background: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Img = styled.img<{big: number}>`
  ${_ => (_.big ? css`
    max-width: inherit;
    max-height: inherit;
    cursor: zoom-out;
  ` : css`
    max-width: 100vw;
    max-height: 100vh;
    cursor: zoom-in;
  `)}
`;

export const LightBox: React.FC<IProps> = ({ visible, onClose, src }) => {
  const [big, setBig] = useState(false);
  useEffect(() => {
    if (visible) {
      disableScroll();
    }
  }, [visible]);
  return (
    <NoSSR>
      {
        !server && ReactDOM.createPortal(
          <AnimatePresence
            onExitComplete={() => {
              if (!visible) {
                enableScroll();
                setBig(false);
              }
            }}
          >
            {visible && (
              <Wrapper
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0 }}
              >
                <Box big={big ? 1 : 0}>
                  <CloseBtn
                    onClick={onClose}
                  >
                    <X color="#fff" />
                  </CloseBtn>
                  <Img
                    big={big ? 1 : 0}
                    onClick={() => setBig(!big)}
                    src={src}
                  />
                </Box>
              </Wrapper>
            )}
          </AnimatePresence>,
          document.querySelector('body')!,
        )
      }
    </NoSSR>
  );
};
