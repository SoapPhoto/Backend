/// <reference types="../typings/index" />
/// <reference types="../typings/typing" />

import '@common/env';

import next from 'next';
import express, { Request, Response } from 'express';
import mobxReact from 'mobx-react';
import path from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import proxy from 'http-proxy-middleware';
import LRUCache from 'lru-cache';

import { routeObject } from '@common/routes';
import { LocaleTypeValues, LocaleType } from '@common/enum/locale';

const dev = process.env.NODE_ENV !== 'production';
// const dev = false;

const app = next({ dev, quiet: false });
const handle = app.getRequestHandler();

mobxReact.useStaticRendering(true);

const tranLocate = (value: string) => value.replace(/_/g, '-').replace(/\s/g, '').toLowerCase().split(',')[0];

const ssrCache = new LRUCache({
  max: 1000, // cache item count
  // maxAge: 1000 * 60 * 60, // 1hour
  maxAge: 1000 * 30, // 30 ses
});

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

  server.get('/service-worker.js', (req, res) => {
    const data = path.join(process.cwd(), '.next', 'service-worker.js');
    res.sendFile(data);
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
      '/graphql',
      proxy({ target: process.env.SERVER_URL, changeOrigin: true }),
    );
    server.use(
      '/socket.io',
      proxy({ target: process.env.SERVER_URL, changeOrigin: true }),
    );
  }

  server.get('*', (req, res) => handle(req, res));

  server.listen(process.env.PAGE_PORT, () => {
    console.log(`> Ready on http://localhost:${process.env.PAGE_PORT}`);
  });
});

const getCacheKey = (req: any) => `${req.url}`;

async function renderAndCache(req: any, res: any, pagePath: any, queryParams: any) {
  const key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    res.setHeader('x-cache', 'HIT');
    res.send(ssrCache.get(key));
    return;
  }

  try {
    // If not let's render the page into HTML
    const html = await app.renderToHTML(req, res, pagePath, queryParams);

    // Something is wrong with the request, let's skip the cache
    if (res.statusCode !== 200) {
      res.send(html);
      return;
    }

    // Let's cache this page
    ssrCache.set(key, html);

    res.setHeader('x-cache', 'MISS');
    res.send(html);
  } catch (err) {
    app.renderError(err, req, res, pagePath, queryParams);
  }
}
