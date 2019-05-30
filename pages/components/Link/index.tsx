import { isFunction } from 'lodash';
import { LinkProps } from 'next-routes';
import BaseLink from 'next/link';
import React, { Children } from 'react';

import { store } from '@pages/stores/init';

export class Link extends React.Component<LinkProps> {
  public render() {
    const { children, href, as, ...restProps } = this.props;
    const child: any = Children.only(children);
    return (
      <BaseLink {...this.props} >
        {React.cloneElement(child, {
          ...restProps,
          onClick: (e: any) => {
            store.appStore.setRoute({
              as: this.props.as as string,
              href: this.props.href as string,
              options: { shallow: this.props.shallow },
              action: this.props.replace ? 'REPLACE' : 'PUSH',
            });
            if (child.props && isFunction(child.props.onClick)) {
              child.props.onClick(e);
            }
            if (isFunction((restProps as any).onClick)) {
              (restProps as any).onClick(e);
            }
          },
        })}
      </BaseLink>
    );
  }
}
