import { isFunction } from 'lodash';
import React, { Children } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';
import PopperJS, { Data, Placement } from 'popper.js';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import { ThemeWrapper } from '@lib/containers/Theme';
import { Popper } from '../Popper';
import { Arrow, Content } from './styles';
import { server } from '@lib/common/utils';

const transitionStyles: {
  [key in TransitionStatus]?: any
} = {
  entering: { opacity: 1, transform: 'scale(1)' },
  entered: { opacity: 1, transform: 'scale(1)' },
  exiting: { opacity: 0, transform: 'scale(.98)' },
  exited: { opacity: 0, transform: 'scale(.98)' },
};

type Trigger = 'hover' | 'click';

export type PopoverTheme = 'dark' | 'light';

interface IPopoverProps {
  content: React.ReactElement;
  contentStyle?: React.CSSProperties;
  /**
   * 触发事件，默认`hover`
   *
   * @type {Trigger}
   * @memberof IPopoverProps
   */
  trigger: Trigger;
  onClose?: () => void;
  onOpen?: () => void;
  /**
   * 是否有箭头，默认`true`
   *
   * @type {boolean}
   * @memberof IPopoverProps
   */
  arrow?: boolean;
  theme: PopoverTheme;
  /**
   * Popover 显示位置，默认`bottom`
   *
   * @type {Placement}
   * @memberof IPopoverProps
   */
  placement: Placement;
  openDelay?: number;
}

@observer
export class Popover extends React.PureComponent<IPopoverProps> {
  public static defaultProps: Partial<IPopoverProps> = {
    theme: 'light',
    placement: 'bottom',
    trigger: 'hover',
  };

  @observable public visible = false;

  @observable public placement: Placement = this.props.placement;

  public delay?: NodeJS.Timeout;

  public _timer?: NodeJS.Timeout;

  public arrow?: HTMLDivElement;

  public popper?: PopperJS;

  public arrowRef = (ref: HTMLDivElement) => {
    if (ref) {
      this.arrow = ref;
      this.forceUpdate();
    }
  }

  public onClose = () => {
    if (isFunction(this.props.onClose)) {
      this.props.onClose();
    }
    this.visible = false;
  }

  public close = (isDelay = false) => {
    clearTimeout(this._timer!);
    if (isDelay) {
      this._timer = setTimeout(() => {
        this.visible = false;
      }, 150);
    } else {
      this.visible = false;
    }
  }

  public open = () => {
    if (this.props.openDelay) {
      clearTimeout(this._timer!);
      this._timer = setTimeout(() => {
        if (isFunction(this.props.onOpen)) {
          this.props.onOpen();
        }
        this.visible = true;
      }, this.props.openDelay);
    } else {
      if (isFunction(this.props.onOpen)) {
        this.props.onOpen();
      }
      this.visible = true;
    }
  }

  public selfEvents = (child: any, type: string, e: any) => {
    if (child && child.props && isFunction(child.props[type])) {
      child.props[type](e);
    }
  }

  public render() {
    const {
      children,
      content,
      contentStyle,
      arrow = true,
      theme,
      placement,
      trigger,
    } = this.props;
    const child: any = Children.only(children);
    const event = {
      onClick: (e: any) => {
        if (trigger === 'click') {
          this.open();
        }
        this.selfEvents(child, 'onClick', e);
      },
      onMouseEnter: (e: any) => {
        if (trigger === 'hover') {
          this.open();
        }
        this.selfEvents(child, 'onMouseEnter', e);
      },
      onMouseLeave: (e: any) => {
        if (trigger === 'hover') {
          this.close(true);
        }
        this.selfEvents(child, 'onMouseLeave', e);
      },
    };
    const childrenRender = React.cloneElement(child, {
      ...event,
    });
    const contentChild = Children.only(content);
    const cntentRender = React.cloneElement(contentChild, {
      onMouseOver: (e: any) => {
        if (trigger === 'hover') {
          clearTimeout(this._timer!);
          this.visible = true;
        }
        this.selfEvents(contentChild, 'onMouseOver', e);
      },
      onMouseOut: (e: any) => {
        if (trigger === 'hover') {
          this.close(true);
        }
        this.selfEvents(contentChild, 'onMouseOut', e);
      },
    });
    if (server) {
      return childrenRender
    }
    return (
      <ThemeWrapper>
        <Popper
          transition
          placement={placement}
          ref={e => {
            if (e) {
              this.popper = e.popper;
            }
          }}
          modifiers={{
            offset: {
              enabled: true,
              offset: '0, 10',
            },
            preventOverflow: {
              boundariesElement: 'scrollParent',
            },
            arrow: {
              enabled: arrow,
              element: this.arrow,
            },
          }}
          onCreate={(data: Data) => {
            if (arrow) {
              if (this.placement !== data.placement) {
                this.placement = data.placement;
              }
            }
          }}
          onUpdate={(data: Data) => {
            if (arrow) {
              if (this.placement !== data.placement) {
                this.placement = data.placement;
              }
            }
          }}
          visible={this.visible}
          onClose={this.onClose}
          content={({ visible, close }) => (
            <Transition
              onExited={() => close()}
              in={visible}
              appear
              timeout={200}
            >
              {state => (
                <div style={{ ...transitionStyles[state], transition: '.2s all ease' }}>
                  {
                    arrow && (
                      <Arrow
                        x-theme={theme}
                        x-placement={this.placement}
                        placement={this.placement}
                        ref={this.arrowRef}
                      />
                    )
                  }
                  <Content x-theme={theme} style={contentStyle}>
                    {cntentRender}
                  </Content>
                </div>
              )}
            </Transition>
          )}
        >
          {childrenRender}
        </Popper>
      </ThemeWrapper>
    );
  }
}
