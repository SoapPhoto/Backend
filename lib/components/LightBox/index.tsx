import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'react-feather';
import styled, { css } from 'styled-components';

import { enableScroll, disableScroll, server } from '@lib/common/utils';
import { Image } from '../Image';
import { IconButton } from '../Button';
import { NoSSR } from '../SSR';

interface IProps {
  visible: boolean;
  onClose: () => void;
  src: string;
  size: {
    width: number;
    height: number;
  };
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

const Box = styled.div<{ big: number; type: string }>`
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  overflow: auto;
  justify-content: center;
  align-items: center;
  ${_ => (_.big ? css`
    ${/x/.test(_.type) ? css`
      justify-content: normal;
    ` : ''}
    ${/y/.test(_.type) ? css`
      align-items: baseline;
    ` : ''}
  ` : '')}
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

const Img = styled(Image) <{ big: number; noBig: number }>`
  ${_ => (_.big ? css`
    max-width: inherit;
    max-height: inherit;
    cursor: zoom-out;
  ` : css`
    max-width: 100vw;
    max-height: 100vh;
    ${!_.noBig ? `
      cursor: zoom-in;
    ` : ''}
  `)}
`;

export const LightBox: React.FC<IProps> = ({
  visible, onClose, src, size,
}) => {
  const [big, setBig] = useState(false);
  const [bigType, setBigType] = useState('');
  useEffect(() => {
    if (visible) {
      disableScroll();
    }
  }, [visible]);
  // 组件销毁时恢复
  useEffect(() => () => enableScroll(), []);
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let type = '';
    if (size.width > width + 200) {
      type += 'x';
    }
    if (size.height > height + 200) {
      type += 'y';
    }
    setBigType(type);
  }, [size]);
  const openBig = useCallback(() => {
    if (!(bigType === '')) {
      setBig(!big);
    }
  }, [big, bigType]);
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
                <Box big={big ? 1 : 0} type={bigType}>
                  <CloseBtn
                    onClick={onClose}
                  >
                    <X size={16} color="#fff" />
                  </CloseBtn>
                  <Img
                    big={big ? 1 : 0}
                    noBig={bigType === '' ? 1 : 0}
                    onClick={openBig}
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
