import React, { forwardRef } from 'react';
import { createPortal } from 'react-dom';

import { useEnhancedEffect } from '@lib/common/hooks/useEnhancedEffect';

type Container = React.ReactInstance | (() => React.ReactInstance | null) | null

interface IPortalProps {
  container?: Container;
}

function getContainer(container: Container) {
  container = typeof container === 'function' ? container() : container;
  return container;
}

export const Portal: React.FC<IPortalProps> = ({ children, container }) => {
  const [mountNode, setMountNode] = React.useState<React.Component<any, {}, any> | Element | null>(null);
  useEnhancedEffect(() => {
    setMountNode(getContainer(container || null) || document.body);
  }, []);
  return mountNode ? createPortal(children, mountNode as any) : mountNode;
};
