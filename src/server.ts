/* eslint-disable import/first */
/// <reference types="../typings/index" />
/// <reference types="../typings/typing" />

require('dotenv').config();

import next from 'next';
import express, { Request, Response } from 'express';
import mobxReact from 'mobx-react';
import { configure } from 'mobx';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import proxy from 'http-proxy-middleware';

import { routeObject } from '@common/routes';
import { LocaleTypeValues, LocaleType } from '@common/enum/locale';

const dev = process.env.NODE_ENV !== 'production';
// const dev = false;

const app = next({ dev, quiet: false });
const handle = app.getRequestHandler();

mobxReact.useStaticRendering(true);

const tranLocate = (value: string) => value.replace(/_/g, '-').replace(/\s/g, '').toLowerCase().split(',')[0];

app.prepare().then(() => {
  const server = express();
  server.use(helmet());
  server.use(cookieParser());
  server.use(responseTime());
  server.use(express.static('static'));
  server.use((req: any, res: any, nextCb) => {
    const header = req.get('accept-language');
    const cookie = req.cookies.locate;
    const acceptedLanguages = (cookie || header || '').split(';');
    const headerLocate = tranLocate(cookie || acceptedLanguages[0]) as LocaleType;
    if (LocaleTypeValues.includes(headerLocate)) {
      req.locale = headerLocate;
    } else {
      req.locale = LocaleType['zh-CN'];
    }
    nextCb();
  });

  server.get('/_next/*', (req, res) => {
    /* serving _next static content using next.js handler */
    handle(req, res);
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const key in routeObject) {
    if (key) {
      server.get(key, (req: Request, res: Response) => app.render(req, res, `/${routeObject[key]}`, req.query));
    }
  }

  if (dev) {
    server.use(
      '/api',
      proxy({ target: process.env.SERVER_URL, changeOrigin: true }),
    );
    server.use(
      '/oauth',
      proxy({ target: process.env.SERVER_URL, changeOrigin: true }),
    );
    server.use(
      '/auth',
      proxy({ target: process.env.SERVER_URL, changeOrigin: true }),
    );
    server.use(
      '/graphql',
      proxy({ target: process.env.SERVER_URL, changeOrigin: true }),
    );
  }

  server.get('*', (req, res) => handle(req, res));

  server.listen(process.env.PAGE_PORT, () => {
    console.log(`> Ready on http://localhost:${process.env.PAGE_PORT}`);
  });
});
