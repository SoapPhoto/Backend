import { store } from '@pages/stores/init';
import { LinkProps } from 'next-routes';
import BaseLink from 'next/link';
import React, { Children } from 'react';

export class Link extends React.Component<LinkProps> {
  public render() {
    const { children } = this.props;
    const child: any = Children.only(children);
    return (
      <BaseLink {...this.props} >
        {React.cloneElement(child, {
          onClick: (e: any) => {
            store.appStore.setRoute({
              as: this.props.as as string,
              href: this.props.href as string,
              options: { shallow: this.props.shallow },
              action: this.props.replace ? 'REPLACE' : 'PUSH',
            });
            if (child.props && typeof child.props.onClick === 'function') {
              child.props.onClick(e);
            }
          },
        })}
      </BaseLink>
    );
  }
}
