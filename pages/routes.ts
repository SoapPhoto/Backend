import Routes, * as routes from 'next-routes';
import { ComponentType } from 'react';

import { Link as BaseLink } from '@pages/components';

interface IRouteObject {
  [key: string]: string;
}

export const routeObject: IRouteObject = {
  '/': 'views/home',
  '/login': 'views/auth/login',
  '/validatoremail': 'views/auth/validatoremail',
  '/upload': 'views/upload',
  '/picture/:id([0-9]+)': 'views/picture',
  '/setting/:type(profile|basic)': 'views/setting',
  '/@:username': 'views/user',
  '/@:username/:type(like)': 'views/user?more',
};

const router = (routes as any)({
  Link: BaseLink,
}) as Routes;

for (const route in routeObject) {
  if (route) {
    router.add(routeObject[route], route);
  }
}

export const Link = router.Link as ComponentType<routes.LinkProps>;

export const Router = router.Router as routes.Router;
