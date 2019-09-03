import { createContext } from 'react';
import { IRouter } from '.';

const defaultContext: IRouter = {
  pathname: '/',
  query: {},
  params: {},
  href: '',
  pushRoute: async () => false,
  replaceRoute: async () => false,
  back: () => null,
};

export const RouterContext = createContext<IRouter>(defaultContext);
