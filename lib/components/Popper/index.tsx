import {
  createPopper, Instance, Modifier, Placement, State,
} from '@popperjs/core';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Portal } from 'react-portal';

import { isIn } from '@lib/common/utils';
import { observer } from 'mobx-react';
import { PortalWrapper } from '../Portal';

interface IChildProps {
  visible: boolean;
  close(): void;
  wrapperRef: any;
}


type ContentFuncType = (props: IChildProps) => React.ReactNode;

type ContentType = React.ReactNode | ContentFuncType;

interface INewPopperProps {
  children: ContentType;
}
export interface IPopperProps {
  placement: Placement;
  visible: boolean;
  content: ContentType;
  transition?: boolean;
  place?: boolean;
  wrapperStyle?: React.CSSProperties;
  getContainer?: React.ReactInstance | (() => React.ReactInstance | null) | null;
  modifiers?: Partial<Modifier<any, any>>[];
  onClose(): void;
  onCreate?(data: Partial<State>): void;
  onUpdate?(data: Partial<State>): void;
}

export const PopperWrapper = styled.div`
  z-index: 1100;
`;

@observer
export class Popper extends React.Component<IPopperProps> {
  public popperRef = React.createRef<HTMLDivElement>();

  public popper?: Instance;

  public componentDidUpdate() {
    const { visible } = this.props;
    if (visible) {
      this.handleOpen();
    }
  }

  public componentWillUnmount() {
    this.handleClose();
  }

  public ifEl = (e: MouseEvent) => {
    if (!this.props.visible) {
      return;
    }
    // eslint-disable-next-line react/no-find-dom-node
    const referenceNode = ReactDOM.findDOMNode(this);
    if (!isIn(e.target as Node, this.popperRef.current!) && !isIn(e.target as Node, referenceNode as Element)) {
      if (this.props.onClose) this.props.onClose();
    }
  }

  public handleOpen = () => {
    if (this.popper) {
      this.handleClose();
    }
    document.addEventListener('mousedown', this.ifEl);
    // eslint-disable-next-line react/no-find-dom-node
    const referenceNode = ReactDOM.findDOMNode(this) as Element;
    this.popper = createPopper(referenceNode, this.popperRef.current!, {
      placement: this.props.placement,
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            boundary: document.querySelector('body')!,
          },
        },
        ...this.props.modifiers || [],
      ],
      onFirstUpdate: this.props.onCreate,
      // afterWrite: this.props.onCreate,
    });
  }

  public handleClose = () => {
    document.removeEventListener('mousedown', this.ifEl);
    if (!this.popper) {
      return;
    }

    this.popper.destroy();
    this.popper = undefined;
  }

  public renderContent = () => {
  }

  public render() {
    const {
      children, visible, content, wrapperStyle,
    } = this.props;
    const childProps: IChildProps = {
      visible,
      close: () => {
        this.handleClose();
      },
      wrapperRef: this.popperRef,
    };
    const c = typeof content === 'function' ? content(childProps) : React.cloneElement(content as any, {
      ref: this.popperRef,
    });
    // const renders = (
    //   <PopperWrapper style={wrapperStyle} ref={this.popperRef}>
    //     {c}
    //   </PopperWrapper>
    // );
    return (
      <>
        {children}
        <PortalWrapper visible={visible}>
          {() => <div style={wrapperStyle}>{c}</div>}
        </PortalWrapper>
      </>
    );
  }
}
