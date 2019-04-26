import * as parse from 'url-parse';

export const parsePath = (asPath: string) => parse(asPath, true);
