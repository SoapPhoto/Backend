import { NextComponentType, NextContext } from 'next';
import { DefaultQuery, RouterProps } from 'next/router';

import { IMyMobxStore } from '@lib/stores/init';
import { Request, Response } from 'express';
import { UserEntity } from './user';
import { IPathInfo } from '../utils';

export interface ICustomNextContext<Q extends DefaultQuery = DefaultQuery> {
  mobxStore: IMyMobxStore;
  pathname: string;
  query: Q;
  route: IPathInfo;
  asPath: string;
  req?: Request & { user?: UserEntity };
  res?: Response;
  err?: any;
}

export interface ICustomNextAppContext<Q extends DefaultQuery = DefaultQuery> {
  Component: NextComponentType<any, any, NextContext<Q>>;
  router: RouterProps<Q>;
  ctx: ICustomNextContext<Q>;
}

export interface ICustomNextPage<P = {}, IP = P> {
  (props: P): JSX.Element;
  getInitialProps?(ctx: ICustomNextContext): Promise<IP>;
}


export interface IPaginationList<T> {
  timestamp: number;
  pageSize: number;
  page: number;
  count: number;
  data: T[];
}

export interface IListRequest<T> {
  timestamp: number;
  pageSize: number;
  page: number;
  count: number;
  data: T;
}

export interface IBaseQuery {
  page: number;
  pageSize: number;
  timestamp: number;
  [key: string]: number | string;
}

export interface IBaseScreenProps {
  statusCode: number;
  error: {
    message?: string;
    statusCode: number;
  };
}
