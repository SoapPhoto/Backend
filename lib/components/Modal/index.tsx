import React, {
  CSSProperties, useRef, useCallback, memo,
} from 'react';
import { Transition } from '@react-spring/web/index.cjs';
import { timingFunctions } from 'polished';

import {
  enableScroll, disableScroll,
} from '@lib/common/utils';
import { isFunction } from 'lodash';
import { DefaultTheme } from 'styled-components';
import { useEnhancedEffect } from '@lib/common/hooks/useEnhancedEffect';
import {
  Box, Content, Mask, Wrapper, XIcon,
} from './styles';
import { Portal } from '../Portal';

export interface IModalProps {
  visible: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  closeIcon?: boolean;
  theme?: DefaultTheme;
  fullscreen?: boolean;
  boxStyle?: React.CSSProperties;
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDestroy = useRef<boolean>(visible);
  const shouldClose = useRef<boolean | null>(null);
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
  const handleClose = useCallback(() => {
    if (isClose.current) return;
    isClose.current = true;
    if (isFunction(onClose)) {
      onClose();
    }
  }, [onClose]);
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (shouldClose.current === null) {
      shouldClose.current = true;
    }
    if (shouldClose.current && (e.target === contentRef.current || e.target === wrapperRef.current)) {
      handleClose();
    }
    shouldClose.current = null;
  }, [handleClose]);

  useEnhancedEffect(() => {
    if (visible) {
      isClose.current = false;
      setDestroy(false);
      onEnter();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => () => onDestroy(), []);

  const handleContentOnMouseUp = useCallback(() => {
    shouldClose.current = null;
  }, []);
  // const handleContentOnClick = useCallback(() => {
  //   shouldClose.current = false;
  // }, []);
  const handleContentOnMouseDown = useCallback(() => {
    shouldClose.current = false;
  }, []);

  return (
    <Portal>
      <Transition
        items={visible}
        config={{
          duration: 200,
        }}
        from={{
          transform: 'scale3d(0.98, 0.98, 0.98)',
          opacity: 0,
        }}
        enter={{ opacity: 1, transform: 'scale3d(1, 1, 1)' }}
        leave={{
          opacity: 0,
          transform: 'scale3d(0.98, 0.98, 0.98)',
          pointerEvents: 'none',
        }}
        onRest={() => {
          console.log(visible);
          if (!visible) {
            onDestroy();
          }
        }}
      >
        {
          (show: boolean) => show && (styles => (
            <div>
              <Mask
                style={{
                  transitionTimingFunction: timingFunctions('easeInOutSine'),
                  transition: '.2s all',
                  opacity: styles.opacity as number,
                  zIndex: 1000 + _modalIndex,
                }}
              />
              <Wrapper
                fullscreen={fullscreen ? 1 : 0}
                style={{ zIndex: 1000 + _modalIndex }}
                onClick={handleClick}
                ref={wrapperRef}
              >
                <Content ref={contentRef}>
                  <Box
                    style={{
                      transitionTimingFunction: timingFunctions('easeInOutSine'),
                      transition: '.2s all',
                      ...boxStyle || {},
                      ...styles as any,
                    }}
                    className={className}
                    onMouseDown={handleContentOnMouseDown}
                    onMouseUp={handleContentOnMouseUp}
                    onClick={handleContentOnMouseUp}
                  >
                    {
                      closeIcon && fullscreen
                          && <XIcon onClick={onClose} />
                    }
                    {children}
                  </Box>
                </Content>
              </Wrapper>
            </div>
          ))
        }
      </Transition>
    </Portal>
  );
});
