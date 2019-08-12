import Routes, * as routes from 'next-routes';
import { ComponentType } from 'react';

import { Link as BaseLink } from '@lib/components';
import { SettingTypeValues, UserTypeValues } from '@common/enum/router';

interface IRouteObject {
  [key: string]: string;
}

export const routeObject: IRouteObject = {
  '/': 'views/home',
  '/login': 'views/auth/login',
  '/validatoremail': 'views/auth/validatoremail',
  '/upload': 'views/upload',
  '/picture/:id([0-9]+)': 'views/picture',
  [`/setting/:type(${SettingTypeValues.join('|')})`]: 'views/setting',
  [`/@:username/:type(${UserTypeValues.join('|')})?`]: 'views/user',
  '/tag/:name': 'views/tag',
  '/collection/:id': 'views/collection',
};

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
