import Routes, * as routes from 'next-routes';
import { ComponentType } from 'react';

import { routeObject } from '@common/routes';
import { Link as BaseLink } from '@lib/components/Link';


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
