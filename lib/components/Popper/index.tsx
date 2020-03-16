import PopperJS, { Data, Modifiers, Placement } from 'popper.js';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Portal } from 'react-portal';

import { isIn } from '@lib/common/utils';
import { observer } from 'mobx-react';

interface IChildProps {
  visible: boolean;
  close(): void;
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
  modifiers?: Modifiers;
  onClose(): void;
  onCreate?(data: Data): void;
  onUpdate?(data: Data): void;
}

export const PopperWrapper = styled.div`
  z-index: 1100;
`;

@observer
export class Popper extends React.Component<IPopperProps> {
  // public static getDerivedStateFromProps(nextProps: IPopperProps) {
  //   if (nextProps.visible) {
  //     return {
  //       exited: false,
  //     };
  //   }

  //   if (!nextProps.transition) {
  //     return {
  //       exited: true,
  //     };
  //   }

  //   return null;
  // }

  public popperRef = React.createRef<HTMLDivElement>();

  public popper?: PopperJS;

  public state = {
    exited: !this.props.visible,
  };

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
    this.popper = new PopperJS(referenceNode, this.popperRef.current!, {
      placement: this.props.placement,
      modifiers: {
        preventOverflow: {
          boundariesElement: document.querySelector('body')!,
        },
        ...this.props.modifiers || {},
      },
      onCreate: this.props.onCreate,
      onUpdate: this.props.onUpdate,
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
      children, wrapperStyle, visible, content, place,
    } = this.props;
    const childProps: IChildProps = {
      visible,
      close: () => {
        this.handleClose();
        this.setState({
          exited: true,
        });
      },
    };
    const c = typeof content === 'function' ? content(childProps) : content;
    console.log(typeof content === 'function');
    const renders = (
      <PopperWrapper style={wrapperStyle} ref={this.popperRef}>
        {c}
      </PopperWrapper>
    );
    return (
      <>
        {children}
        {
          place ? renders : (
            <Portal>
              {renders}
            </Portal>
          )
        }
      </>
    );
  }
}
