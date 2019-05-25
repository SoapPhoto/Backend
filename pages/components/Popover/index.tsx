import React, { Children } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Data, Placement } from 'popper.js';
import { Popper } from '../Popper';
import { Arrow, Content } from './styles';

const transitionStyles: {
  [key in TransitionStatus]?: any
} = {
  entering: { opacity: 1, transform: 'scale(1)' },
  entered: { opacity: 1, transform: 'scale(1)' },
  exiting: { opacity: 0, transform: 'scale(.98)' },
  exited: { opacity: 0, transform: 'scale(.98)' },
};

type Trigger = 'hover' | 'click';

interface IPopoverProps {
  content: React.ReactElement;
  contentStyle?: React.CSSProperties;
  trigger?: Trigger;
  onClose?: () => void;
  /**
   * 是否有箭头，默认有
   *
   * @type {boolean}
   * @memberof IPopoverProps
   */
  arrow?: boolean;
  placement?: Placement;
  openDelay?: number;
}

@observer
export class Popover extends React.PureComponent<IPopoverProps> {
  @observable public visible = false;
  @observable public placement: Placement = 'bottom';

  public delay?: NodeJS.Timeout;
  public _timer?: NodeJS.Timeout;

  public arrow?: HTMLDivElement;
  public arrowRef = (ref: HTMLDivElement) => {
    if (ref) {
      this.arrow = ref;
      this.forceUpdate();
    }
  }
  public onClose = () => {
    if (typeof this.props.onClose === 'function') {
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
        this.visible = true;
      }, this.props.openDelay);
    } else {
      this.visible = true;
    }
  }
  public selfEvents = (child: any, type: string, e: any) => {
    if (child && child.props && typeof child.props[type] === 'function') {
      child.props[type](e);
    }
  }
  public render() {
    const {
      children,
      content,
      contentStyle,
      arrow = true,
      placement = 'bottom',
      trigger = 'hover',
    } = this.props;
    const child: any = Children.only(children);
    const event = {
      onClick: (e: any) => {
        if (trigger === 'click') {
          this.open();
        }
      },
      onMouseOver: (e: any) => {
        if (trigger === 'hover') {
          this.open();
        }
        this.selfEvents(child, 'onMouseOver', e);
      },
      onMouseOut: (e: any) => {
        if (trigger === 'hover') {
          this.close(true);
        }
        this.selfEvents(child, 'onMouseOut', e);
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
    console.log(this.placement);
    return (
      <Popper
        transition
        placement={placement}
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
                  arrow &&
                  <Arrow x-placement={this.placement} placement={this.placement} ref={this.arrowRef}/>
                }
                <Content style={contentStyle}>
                  {cntentRender}
                </Content>
              </div>
            )}
          </Transition>
        )}
      >
        {childrenRender}
      </Popper>
    );
  }
}
