import PopperJS from 'popper.js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NoSSR from 'react-no-ssr';

import { server } from '@pages/common/utils';

interface IChildProps {
  visible: boolean;
  close(): void;
}

type ContentFuncType = (props: IChildProps) => React.ReactNode;

type ContentType = React.ReactNode | ContentFuncType;

export interface IPopperProps {
  visible: boolean;
  content: ContentType;
  transition ? : boolean;
  getContainer ? : Element;
  onClose(): void;
}

export function isIn(target: Node, parent: Element) {
  const path: Node[] = [];
  let parentNode: Node | null = target;
  while (parentNode && parentNode !== document.body) {
    path.push(parentNode);
    parentNode = parentNode.parentNode;
  }
  return path.indexOf(parent) !== -1;
}

export class Popper extends React.Component<IPopperProps> {

  public static getDerivedStateFromProps(nextProps: IPopperProps) {
    if (nextProps.visible) {
      return {
        exited: false,
      };
    }

    if (!nextProps.transition) {
      return {
        exited: true,
      };
    }

    return null;
  }
  public popperRef = React.createRef<HTMLDivElement>();
  public popper?: PopperJS;
  public state = {
    exited: !this.props.visible,
  };
  public componentWillUnmount() {
    this.handleClose();
  }
  public componentDidUpdate() {
    if (this.props.visible) {
      this.handleOpen();
    }
  }
  public ifEl = (e: MouseEvent) => {
    if (!this.props.visible) {
      return;
    }
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
    const referenceNode = ReactDOM.findDOMNode(this) as Element;
    this.popper = new PopperJS(referenceNode, this.popperRef.current!, {
      placement: 'bottom-start',
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
    const { visible, content, transition } = this.props;
    const { exited } = this.state;
    const childProps: IChildProps = {
      visible,
      close: () => {
        this.handleClose();
        this.setState({
          exited: true,
        });
      },
    };
    if (!visible && (!transition || exited)) {
      return null;
    }
    return (
      <div ref={this.popperRef}>
        {typeof content === 'function' ? content(childProps) : content}
      </div>
    );
  }
  public render() {
    const { children } = this.props;
    return (
      <>
        {children}
        <NoSSR>
          {!server && ReactDOM.createPortal(
            this.renderContent(),
            this.props.getContainer || document.querySelector('body')!,
          )}
        </NoSSR>
      </>
    );
  }
}
