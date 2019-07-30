import { routeObject } from '@lib/routes';
import { pick } from 'lodash';
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
  const info: IPathInfo = {
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
    for (let i = 0; i < keys.length; i += 1) {
      params[keys[i].name] = result[i + 1];
    }
    info.params = params;
  }
  return info;
};

function setUrlPath(url: string) {
  // eslint-disable-next-line no-restricted-syntax
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
