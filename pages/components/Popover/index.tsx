import React, { Children } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

import { observable } from 'mobx';
import { observer } from 'mobx-react';
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
  onClose: () => void;
}

@observer
export class Popover extends React.PureComponent<IPopoverProps> {
  @observable public visible = false;
  public delay?: NodeJS.Timeout;

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
  public render() {
    const {
      children,
      content,
      contentStyle,
      trigger = 'hover',
    } = this.props;
    const child: any = Children.only(children);
    const event = {
      onClick: (e: any) => {
        if (trigger === 'click') {
          this.visible = true;
        }
        if (child && child.props && typeof child.props.onClick === 'function') {
          child.props.onClick(e);
        }
      },
      onMouseOver: (e: any) => {
        if (trigger === 'hover') {
          this.visible = true;
        }
        if (child && child.props && typeof child.props.onMouseOver === 'function') {
          child.props.onMouseOver(e);
        }
      },
      onMouseOut: (e: any) => {
        if (trigger === 'hover') {
          this.visible = false;
        }
        if (child && child.props && typeof child.props.onMouseOut === 'function') {
          child.props.onMouseOut(e);
        }
      },
    };
    const childrenRender = React.cloneElement(child, {
      ...event,
    });
    const contentChild = Children.only(content);
    const cntentRender = React.cloneElement(contentChild, {
      onMouseOver: (e: any) => {
        if (contentChild && contentChild.props && typeof contentChild.props.onMouseOver === 'function') {
          contentChild.props.onMouseOver(e);
        }
      },
    });
    return (
      <Popper
        transition
        placement="bottom-start"
        modifiers={{
          offset: {
            enabled: true,
            offset: '0, 10',
          },
          preventOverflow: {
            boundariesElement: 'scrollParent',
          },
          arrow: {
            enabled: true,
            element: this.arrow,
          },
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
                <Arrow ref={this.arrowRef}/>
                <Content style={contentStyle}>
                  {cntentRender}
                </Content>
                {/*  */}
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
