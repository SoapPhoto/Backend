import { NextComponentType, NextContext } from 'next';
import { DefaultQuery, RouterProps } from 'next/router';
import { IncomingMessage, ServerResponse } from 'http';

import { IMyMobxStore } from '@pages/stores/init';
import { Request, Response } from 'express';
import { UserEntity } from './user';
import { IPathInfo } from '../utils';

export interface CustomNextContext<Q extends DefaultQuery = DefaultQuery> {
  mobxStore: IMyMobxStore;
  pathname: string;
  query: Q;
  route: IPathInfo;
  asPath: string;
  req?: Request & { user?: UserEntity };
  res?: Response;
  err?: any;
}

export interface CustomNextAppContext<Q extends DefaultQuery = DefaultQuery> {
  Component: NextComponentType<any, any, NextContext<Q>>;
  router: RouterProps<Q>;
  ctx: CustomNextContext<Q>;
}

export type CustomNextPage<P = {}, IP = P> = {
  (props: P): JSX.Element
  getInitialProps?(ctx: CustomNextContext): Promise<IP>
}


export interface PaginationList {
  timestamp: number;
  pageSize: number;
  page: number;
  count: number;
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
  }
}
