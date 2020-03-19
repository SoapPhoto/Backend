import { isFunction, debounce } from 'lodash';
import React, { Children } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import {
  Instance, Placement,
} from '@popperjs/core';
import Animate from 'rc-animate';

import { isMobile } from '@lib/common/utils/isMobile';
import { Lazy } from '../Modal/Lazy';
import { Popper } from '../Popper';
import { Arrow, Content, Wrapper } from './styles';

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
  trigger?: Trigger;
  onClose?: () => void;
  onOpen?: () => void;
  /**
   * 是否有箭头，默认`true`
   *
   * @type {boolean}
   * @memberof IPopoverProps
   */
  arrow?: boolean;
  theme: PopoverTheme | null;
  /**
   * Popover 显示位置，默认`bottom`
   *
   * @type {Placement}
   * @memberof IPopoverProps
   */
  placement: Placement;
  openDelay?: number;
  /**
   * 是否在移动端的时候显示
   *
   * @type {boolean}
   * @memberof IPopoverProps
   */
  mobile?: boolean;
  place?: boolean;
  wrapperStyle?: React.CSSProperties;
  getContainer?: React.ReactInstance | (() => React.ReactInstance | null) | null;
}

@observer
export class Popover extends React.Component<IPopoverProps> {
  // eslint-disable-next-line react/sort-comp
  public static defaultProps: Partial<IPopoverProps> = {
    theme: 'light',
    placement: 'bottom',
  };

  @observable public visible = false;

  @observable public isMini = false;

  @observable public placement: Placement = this.props.placement;

  public _media?: MediaQueryList;

  public delay?: number;

  public _timer?: number;

  public arrow?: HTMLDivElement;

  public popper?: Instance;

  public componentDidMount() {
    this.isMini = isMobile();
    window.addEventListener('resize', this.handleResize);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  @action public setVisible = (value: boolean) => {
    this.visible = value;
  };

  public handleResize = debounce(() => {
    this.isMini = isMobile();
  }, 1000)

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
    this.setVisible(false);
  }

  public close = (isDelay = false) => {
    clearTimeout(this._timer!);
    if (isDelay) {
      this._timer = window.setTimeout(() => {
        this.setVisible(false);
      }, 150);
    } else {
      this.setVisible(false);
    }
  }

  public open = () => {
    if (this.props.openDelay) {
      clearTimeout(this._timer!);
      this._timer = window.setTimeout(() => {
        if (isFunction(this.props.onOpen)) {
          this.props.onOpen();
        }
        this.setVisible(true);
      }, this.props.openDelay);
    } else {
      if (isFunction(this.props.onOpen)) {
        this.props.onOpen();
      }
      this.setVisible(true);
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
      place = false,
      placement,
      trigger,
      mobile,
      getContainer,
      wrapperStyle,
    } = this.props;
    const child: any = Children.only(children);
    const event = {
      onClick: (e: any) => {
        if (trigger === 'click') {
          if (this.visible) {
            this.close();
          } else {
            this.open();
          }
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
    const contentRender = React.cloneElement(contentChild, {
      onMouseOver: (e: any) => {
        if (trigger === 'hover') {
          clearTimeout(this._timer!);
          this.setVisible(true);
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
    if (!mobile && this.isMini) {
      return childrenRender;
    }
    return (
      <Popper
        getContainer={getContainer}
        wrapperStyle={wrapperStyle}
        transition
        place={place}
        placement={placement}
        ref={(e) => {
          if (e) {
            this.popper = e.popper;
          }
        }}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              padding: 12,
              altBoundary: true,
            },
          },
          this.arrow ? {
            name: 'arrow',
            options: {
              element: this.arrow,
            },
          } : {},
        ]}
        visible={this.visible}
        onClose={this.onClose}
        content={(
          <Wrapper>
            <Animate showProp="visible" transitionName="popper" transitionAppear>
              <Lazy
                visible={this.visible}
                hiddenClassName="none"
              >
                {
                  arrow && (
                    <Arrow
                      x-theme={theme}
                      ref={this.arrowRef}
                    />
                  )
                }
                <Content x-theme={theme} style={contentStyle}>
                  {contentRender}
                </Content>
              </Lazy>
            </Animate>
          </Wrapper>
        )}
      >
        {childrenRender}
      </Popper>
    );
  }
}
