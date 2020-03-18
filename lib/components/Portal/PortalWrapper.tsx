import { Portal, PortalProps } from 'react-portal';
import React, { useRef, useEffect } from 'react';

interface IProps {
  forceRender?: boolean;
  visible?: boolean;
  children: (prop: IPortalWrapperChildProps) => any;
}

export interface IPortalWrapperChildProps {
  getOpenCount: () => number;
}

let openCount = 0;

export const PortalWrapper: React.FC<IProps> = ({
  forceRender, visible, children,
}) => {
  const portalRef = useRef<React.ComponentClass<PortalProps>>(null);
  let portal = null;
  const childProps: IPortalWrapperChildProps = {
    getOpenCount: () => openCount,
  };
  useEffect(() => {
    if (visible) {
      openCount = visible ? openCount + 1 : openCount;
    }
    return () => { openCount = !visible ? openCount - 1 : openCount; };
  }, [visible]);
  if (forceRender || visible || portalRef.current) {
    portal = (
      <Portal ref={portalRef as any}>
        {children(childProps)}
      </Portal>
    );
  }
  return portal;
};
