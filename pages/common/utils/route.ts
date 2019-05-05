import * as pathToRegexp from 'path-to-regexp';
import * as parse from 'url-parse';

interface IKey {
  name: string;
}
type Keys = IKey[];

interface IPathInfo extends parse {
  params: {
    [keyof: string]: string;
  };
}

export const parsePath = (asPath: string, route?: string) => {
  let info: IPathInfo;
  info = {
    params: {},
    ...parse(asPath, true),
  };
  if (route) {
    const params: {[keyof: string]: string} = {};
    const keys: Keys = [];
    const regexp = pathToRegexp(route, keys);
    const result = regexp.exec(asPath);
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < keys.length; i++) {
      params[keys[i].name] = result[i + 1];
    }
    info.params = params;
  }
  return info;
};
