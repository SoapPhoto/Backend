import * as routes from 'next-routes';
import { ComponentType } from 'react';

export const routeObject = {
  'views/home': '/',
  'views/auth/login': '/login',
  'views/upload': '/upload',
  'views/picture': '/picture/:id([0-9]+)',
  'views/setting': '/setting/:type(user|basic)',
};

const router = (routes as any)();

for (const route in routeObject) {
  if (route) {
    router.add(route, routeObject[route]);
  }
}

// const route = (routes as any)()
//   .add('views/home', '/')
//   .add('views/auth/login', '/login')
//   .add('views/upload', '/upload')
//   .add('views/picture', '/picture/:id([0-9]+)')
//   .add('views/setting', '/setting/:type(user)');

export const Link = router.Link as ComponentType<routes.LinkProps>;

export const Router = router.Router as routes.Router;
