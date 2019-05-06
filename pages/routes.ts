import * as routes from 'next-routes';
import { ComponentType } from 'react';

const route = (routes as any)()
  .add('views/home', '/')
  .add('views/auth/login', '/login')
  .add('views/upload', '/upload')
  .add('views/picture', '/picture/:id([0-9]+)');

export const Link = route.Link as ComponentType<routes.LinkProps>;

export const Router = route.Router as routes.Router;
