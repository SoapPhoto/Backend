import { observable, reaction, action } from 'mobx';
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence } from 'framer-motion';

import {
  getScrollWidth, server, enableScroll, disableScroll,
} from '@lib/common/utils';
import { isFunction } from 'lodash';
import { DefaultTheme } from 'styled-components';
import { NoSSR } from '../SSR';
import {
  Box, Content, Mask, Wrapper, XIcon,
} from './styles';

export interface IModalProps {
  visible?: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  closeIcon?: boolean;
  theme?: DefaultTheme;
  fullscreen?: boolean;
  boxStyle?: React.CSSProperties;
  className?: string;
}

let _modalIndex = 0;
@observer
export class Modal extends React.PureComponent<IModalProps> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  static defaultProps = {
    closeIcon: true,
    fullscreen: true,
  }

  public shouldClose: null | boolean = null;

  public contentRef = React.createRef<HTMLDivElement>();

  public wrapperRef = React.createRef<HTMLDivElement>();

  @observable public isDestroy = !this.props.visible;

  public initStyle?: () => void;

  private isClose = false;

  constructor(props: IModalProps) {
    super(props);
    // eslint-disable-next-line react/destructuring-assignment
    reaction(() => this.props.visible, (vis) => {
      if (vis) {
        this.isClose = false;
        this.setDestroy(false);
        this.onEnter();
      }
    });
  }

  public componentWillUnmount() {
    this.onDestroy();
  }

  get scrollWidth() {
    return getScrollWidth();
  }

  @action public setDestroy = (value: boolean) => this.isDestroy = value;


  public handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }
    if (this.shouldClose && (e.target === this.contentRef.current || e.target === this.wrapperRef.current)) {
      this.onClose();
    }
    this.shouldClose = null;
  }

  public handleContentOnMouseUp = () => {
    this.shouldClose = null;
  };

  public handleContentOnClick = () => {
    this.shouldClose = false;
  };

  public handleContentOnMouseDown = () => {
    this.shouldClose = false;
  };

  public onClose = () => {
    if (this.isClose) return;
    this.isClose = true;
    if (isFunction(this.props.onClose)) {
      this.props.onClose();
    }
  }

  public onDestroy = () => {
    if (this.isDestroy) return;
    if (isFunction(this.props.afterClose)) {
      this.props.afterClose();
    }
    _modalIndex--;
    if (_modalIndex === 0) {
      enableScroll();
    }

    this.setDestroy(true);
  }

  public onEnter = () => {
    _modalIndex++;
    disableScroll();
  }

  public render() {
    const {
      visible, boxStyle, children, closeIcon, fullscreen, className,
    } = this.props;
    if (this.isDestroy) {
      return null;
    }
    return (
      <NoSSR>
        {
          !server && ReactDOM.createPortal(
            <AnimatePresence
              onExitComplete={() => {
                if (!visible) {
                  this.onDestroy();
                }
              }}
            >
              {visible && (
                <div>
                  <Mask
                    positionTransition
                    style={{
                      zIndex: 1000 + _modalIndex,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  />
                  <Wrapper fullscreen={fullscreen ? 1 : 0} style={{ zIndex: 1000 + _modalIndex }} onClick={this.handleClick} ref={this.wrapperRef}>
                    <Content ref={this.contentRef}>
                      <Box
                        positionTransition
                        style={{
                          ...boxStyle || {},
                        }}
                        initial={{ opacity: 0, transform: 'scale(0.98)' }}
                        animate={{ opacity: 1, transform: 'scale(1)' }}
                        exit={{ opacity: 0, transform: 'scale(0.98)' }}
                        transition={{ duration: 0.1 }}
                        className={className}
                        onMouseDown={this.handleContentOnMouseDown}
                        onMouseUp={this.handleContentOnMouseUp}
                        onClick={this.handleContentOnMouseUp}
                      >
                        {
                          closeIcon && fullscreen
                          && <XIcon onClick={this.onClose} />
                        }
                        {children}
                      </Box>
                    </Content>
                  </Wrapper>
                </div>
              )}
            </AnimatePresence>,
            document.querySelector('body')!,
          )
        }
      </NoSSR>
    );
  }
}
