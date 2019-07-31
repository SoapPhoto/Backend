import { isFunction } from 'lodash';
import BaseLink from 'next/link';
import React, { Children } from 'react';
import { UrlObject } from 'url';

import { store } from '@lib/stores/init';

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

export const Link: React.FC<ILinkProps> = (props) => {
  const {
    children, href, as, ...restProps
  } = props;
  const child: any = Children.only(children);
  return (
    <BaseLink {...props}>
      {React.cloneElement(child, {
        ...restProps,
        onClick: (e: any) => {
          store.appStore.setRoute({
            as: as as string,
            href: href as string,
            options: { shallow: props.shallow },
            action: props.shallow ? 'REPLACE' : 'PUSH',
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
};