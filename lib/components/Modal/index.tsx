import React, {
  CSSProperties, useRef, useCallback, memo,
} from 'react';
import { rem } from 'polished';
import { Portal } from 'react-portal';
import Animate from 'rc-animate';

import {
  enableScroll, disableScroll,
} from '@lib/common/utils';
import { isFunction } from 'lodash';
import styled, { DefaultTheme } from 'styled-components';
import { useEnhancedEffect } from '@lib/common/hooks/useEnhancedEffect';
import { theme } from '@lib/common/utils/themes';
import {
  Box, Content, LazyMask, LazyWrapper, XIcon,
} from './styles';
import { PortalWrapper } from '../Portal';

export interface IModalProps {
  visible: boolean;
  onClose: () => void;
  afterClose?: () => void;
  closeIcon?: boolean;
  theme?: DefaultTheme;
  fullscreen?: boolean;
  boxStyle?: CSSProperties;
  className?: string;
}

let _modalIndex = 0;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${rem(14)};
  border-bottom: 1px solid ${theme('colors.shadowColor')};
`;

export const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
`;

export const Modal: React.FC<IModalProps> = memo(({
  visible,
  afterClose,
  className,
  boxStyle,
  children,
  onClose,
  closeIcon = true,
  fullscreen = true,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isDestroy = useRef<boolean>(visible);
  const isClose = useRef<boolean>(false);

  const setDestroy = useCallback((value: boolean) => isDestroy.current = value, []);
  const onDestroy = useCallback(() => {
    if (isDestroy.current) return;
    if (isFunction(afterClose)) {
      afterClose();
    }
    if (_modalIndex === 0) return;
    _modalIndex--;
    if (_modalIndex === 0) {
      enableScroll();
    }
    setDestroy(true);
  }, [afterClose, setDestroy]);
  const onEnter = useCallback(() => {
    _modalIndex++;
    disableScroll();
  }, []);
  const onMaskClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  useEnhancedEffect(() => {
    if (visible) {
      isClose.current = false;
      setDestroy(false);
      onEnter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const onEnd = useCallback((_: string, exists: boolean) => !exists && onDestroy(), [onDestroy]);

  return (
    <PortalWrapper visible={visible}>
      {() => (
        <div>
          <Animate onEnd={onEnd} showProp="visible" transitionName="modalMask" transitionAppear>
            <LazyMask
              onClick={onMaskClick}
              visible={visible}
              hiddenClassName="none"
            />
          </Animate>
          <Animate showProp="visible" transitionName="modalContent" transitionAppear>
            <LazyWrapper
              fullscreen={fullscreen ? 1 : 0}
              style={{ zIndex: 1000 + _modalIndex }}
              onClick={onMaskClick}
              visible={visible}
              hiddenClassName="none"
            >
              <Content
                ref={contentRef}
                onClick={onMaskClick}
              >
                <Box
                  className={className}
                  style={boxStyle as any}
                >
                  {
                    closeIcon && fullscreen
                    && <XIcon onClick={onClose} />
                  }
                  {children}
                </Box>
              </Content>
            </LazyWrapper>
          </Animate>
        </div>
      )}
    </PortalWrapper>
  );
});
