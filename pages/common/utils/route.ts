import { routeObject, Router } from '@pages/routes';
import { pick } from 'lodash';
import { RouteParams } from 'next-routes';
import { EventChangeOptions } from 'next/router';
import pathToRegexp from 'path-to-regexp';
import parse from 'url-parse';

interface IKey {
  name: string;
}
type Keys = IKey[];

export interface IPathInfo extends Pick<parse, 'pathname' | 'href' | 'query'> {
  params: { [key: string]: string | undefined };
}

export const parsePath = (asPath: string) => {
  let info: IPathInfo;
  info = {
    params: {},
    ...pick(parse(asPath, true), ['pathname', 'href', 'query']),
  };
  const route = setUrlPath(info.pathname);
  if (route) {
    const params: {[keyof: string]: string} = {};
    const keys: Keys = [];
    const regexp = pathToRegexp(route, keys);
    const result = regexp.exec(info.pathname);
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < keys.length; i++) {
      params[keys[i].name] = result[i + 1];
    }
    info.params = params;
  }
  return info;
};

function setUrlPath(url: string) {
  for (const key in routeObject) {
    if (key) {
      const regexp = pathToRegexp(key);
      if (regexp.test(url)) {
        return key;
      }
    }
  }
  return undefined;
}

class Route {
  public push(
    route: string,
    params?: RouteParams,
    options?: EventChangeOptions,
  ) {
    return Router.pushRoute(route, params, { ...options || {}, action: 'PUSH' });
  }
  public back() {
    Router.back();
  }
  public replace(
    route: string,
    params?: RouteParams,
    options?: EventChangeOptions,
  ) {
    return Router.replaceRoute(route, params, { ...options || {}, action: 'REPLACE' });
  }
  public reload(route: string) {
    return Router.reload(route);
  }
}

export default new Route;
