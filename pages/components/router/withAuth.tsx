import * as React from 'react';

const getDisplayName = (Component: React.ComponentClass) =>
  Component.displayName || Component.name || 'Component';

export const withAuth = (WrappedComponent: React.ComponentClass, role: string) =>
  class extends React.Component {
    public static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;
  };
