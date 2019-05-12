import Routes, * as routes from 'next-routes';
import { ComponentType } from 'react';

interface IRouteObject {
  [key: string]: string;
}

export const routeObject: IRouteObject = {
  'views/home': '/',
  'views/auth/login': '/login',
  'views/upload': '/upload',
  'views/picture': '/picture/:id([0-9]+)',
  'views/setting': '/setting/:type(user|basic)',
  'views/user': '/user/:username',
};

const router = (routes as any)() as Routes;

for (const route in routeObject) {
  if (route) {
    router.add(route, routeObject[route]);
  }
}

export const Link = router.Link as ComponentType<routes.LinkProps>;

export const Router = router.Router as routes.Router;
