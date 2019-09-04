import { observable, reaction, action } from 'mobx';
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

import { getScrollWidth, server, setBodyCss } from '@lib/common/utils';
import { isFunction } from 'lodash';
import { DefaultTheme } from 'styled-components';
import { NoSSR } from '../SSR';
import {
  Box, Content, Mask, Wrapper, XIcon,
} from './styles';

let _modalIndex = 0;

export interface IModalProps {
  visible?: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  closeIcon?: boolean;
  theme?: DefaultTheme;
  boxStyle?: React.CSSProperties;
}

const transitionStyles: {
  [key in TransitionStatus]?: CSSProperties
} = {
  entering: { opacity: 0, transform: 'scale(.98)' },
  entered: { opacity: 1, transform: 'scale(1)' },
  exiting: { opacity: 0, transform: 'scale(.98)' },
  exited: { opacity: 1, transform: 'scale(1)' },
};

const maskTransitionStyles: {
  [key in TransitionStatus]?: CSSProperties
} = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 1 },
};

@observer
export class Modal extends React.PureComponent<IModalProps> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  static defaultProps = {
    closeIcon: true,
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
        if (_modalIndex === 0) {
          this.initStyle = setBodyCss({
            overflowY: 'hidden',
            paddingRight: `${this.scrollWidth}px`,
          });
        }
        // eslint-disable-next-line no-plusplus
        _modalIndex++;
        this.setDestroy(false);
      }
    });
  }

  public componentDidMount() {
    const { visible } = this.props;
    if (visible) {
      this.initStyle = setBodyCss({
        overflowY: 'hidden',
        paddingRight: `${this.scrollWidth}px`,
      });
    }
  }

  public componentWillUnmount() {
    this.onDestroy(true);
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
    this.shouldClose = false;
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

  public onDestroy = (isDestroy = false) => {
    if (isFunction(this.initStyle)) {
      this.initStyle();
    }
    if (isFunction(this.props.afterClose)) {
      this.props.afterClose();
    }
    if (!isDestroy) {
      // eslint-disable-next-line no-plusplus
      _modalIndex--;
    }

    this.setDestroy(true);
  }

  public render() {
    const {
      visible, boxStyle, children, closeIcon,
    } = this.props;
    if (this.isDestroy) {
      return null;
    }
    return (
      <NoSSR>
        {
          !server && ReactDOM.createPortal(
            (
              <Transition
                in={visible}
                onExited={() => this.onDestroy()}
                appear
                timeout={{
                  enter: 0,
                  exit: 200,
                }}
              >
                {
                  state => (
                    <div>
                      <Mask
                        style={{ ...maskTransitionStyles[state], transition: '.2s all ease' }}
                      />
                      <Wrapper onClick={this.handleClick} ref={this.wrapperRef}>

                        <Content ref={this.contentRef}>
                          <Box
                            style={{
                              ...transitionStyles[state],
                              ...boxStyle || {},
                            }}
                            onMouseDown={this.handleContentOnMouseDown}
                            onMouseUp={this.handleContentOnMouseUp}
                            onClick={this.handleContentOnMouseUp}
                          >
                            {
                              closeIcon
                              && <XIcon onClick={this.onClose} />
                            }
                            {children}
                          </Box>
                        </Content>
                      </Wrapper>
                    </div>
                  )
                }
              </Transition>
            ),
            document.querySelector('body')!,
          )
        }
      </NoSSR>
    );
  }
}
