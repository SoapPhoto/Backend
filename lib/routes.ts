import Routes, * as routes from 'next-routes';
import { ComponentType } from 'react';
import qs from 'querystring';

import { routeObject } from '@common/routes';
import { Link as BaseLink } from '@lib/components/Link';
import { parsePath } from './common/utils';


const router = (routes as any)({
  Link: BaseLink,
}) as Routes;

// eslint-disable-next-line no-restricted-syntax
for (const route in routeObject) {
  if (route) {
    router.add(routeObject[route], route);
  }
}

export const Link = router.Link as ComponentType<routes.LinkProps>;

export const Router = router.Router as routes.Router;

export const pushRoute = (
  url: string, querys?: Record<string, string | undefined>,
  config?: Record<string, string | boolean | number>,
) => {
  const { pathname, query } = parsePath(url);
  const q = qs.stringify({
    ...query,
    ...querys,
  });
  return Router.pushRoute(`${pathname}${q ? `?${q}` : ''}`, {}, config);
};
