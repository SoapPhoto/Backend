import { NextComponentType, NextContext } from 'next';
import { DefaultQuery, RouterProps } from 'next/router';
import { IncomingMessage, ServerResponse } from 'http';

import { IMyMobxStore } from '@pages/stores/init';
import { Request, Response } from 'express';
import { UserEntity } from './user';

export interface CustomNextContext<Q extends DefaultQuery = DefaultQuery> {
  mobxStore: IMyMobxStore;
  pathname: string;
  query: Q;
  asPath: string;
  req?: Request & { user?: UserEntity };
  res?: Response;
  err?: Error;
}

export interface CustomNextAppContext<Q extends DefaultQuery = DefaultQuery> {
  Component: NextComponentType<any, any, NextContext<Q>>;
  router: RouterProps<Q>;
  ctx: CustomNextContext<Q>;
}

export interface PaginationList {
  timestamp: number;
  pageSize: number;
  page: number;
  count: number;
}
