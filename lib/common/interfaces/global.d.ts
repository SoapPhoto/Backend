import { NextComponentType } from 'next';
import { NextRouter } from 'next/router';
import { ApolloAppContext } from 'next-with-apollo';

import { IMyMobxStore } from '@lib/stores/init';
import { Request, Response } from 'express';
import { HttpStatus } from '@lib/common/enums/http';
import { UserEntity } from './user';
import { IPathInfo } from '../utils';

export interface IDefaultQuery {
  error?: {
    statusCode?: number;
    [key: string]: any;
  };
}

export interface ICustomNextContext<Q extends IDefaultQuery = IDefaultQuery> extends ApolloAppContext {
  mobxStore: IMyMobxStore;
  pathname: string;
  query: Q;
  route: IPathInfo;
  asPath: string;
  req?: Request & { user?: UserEntity };
  res?: Response;
  err?: Error & {
    statusCode?: number;
  } | null;
}

export interface ICustomNextAppContext<Q extends IDefaultQuery = IDefaultQuery> {
  Component: NextComponentType<ICustomNextContext<Q>>;
  router: NextRouter;
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

export interface IErrorStatus {
  message?: string;
  statusCode: HttpStatus;
}

export interface IBaseScreenProps {
  error: IErrorStatus;
}
