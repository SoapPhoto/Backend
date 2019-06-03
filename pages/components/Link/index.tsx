import { isFunction } from 'lodash';
import BaseLink from 'next/link';
import React, { Children } from 'react';
import { UrlObject } from 'url';

import { store } from '@pages/stores/init';

type Url = string | UrlObject;

interface ILinkProps {
  href: Url;
  as?: Url | undefined;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  onError?: (error: Error) => void;
  /**
   * @deprecated since version 8.1.1-canary.20
   */
  prefetch?: boolean;
}

export class Link extends React.Component<ILinkProps> {
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
