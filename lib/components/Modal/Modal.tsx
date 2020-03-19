import React, {
  CSSProperties, useRef, useCallback, memo, useEffect,
} from 'react';
import Animate from 'rc-animate';

import {
  enableScroll, disableScroll,
} from '@lib/common/utils';
import { isFunction } from 'lodash';
import { DefaultTheme } from 'styled-components';
import { useEnhancedEffect } from '@lib/common/hooks/useEnhancedEffect';
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
  // 是否已经完全关闭
  const isDestroy = useRef<boolean>(!visible);
  // 是否关闭
  const isClose = useRef<boolean>(false);

  const setDestroy = useCallback((value: boolean) => isDestroy.current = value, []);
  const onDestroy = useCallback(() => {
    if (isDestroy.current) return;
    if (isFunction(afterClose)) {
      afterClose();
    }
    isClose.current = true;
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
      if (isClose.current) return;
      isClose.current = true;
      onClose();
    }
  }, [onClose]);

  useEffect(() => () => onDestroy(), []);

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
              style={{ zIndex: 1000 + _modalIndex }}
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
