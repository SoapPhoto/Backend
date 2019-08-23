/* eslint-disable import/first */
require('dotenv').config();

import next from 'next';
import express, { Request, Response } from 'express';
import mobxReact from 'mobx-react';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
// import LRUCache from 'lru-cache';
import responseTime from 'response-time';
import proxy from 'http-proxy-middleware';
import nextI18NextMiddleware from 'next-i18next/middleware';

// import apicache from 'apicache';
import { routeObject } from '@common/routes';
import i18n from '@common/i18n';

const dev = process.env.NODE_ENV !== 'production';
// const dev = false;

const app = next({ dev, quiet: false });
const handle = app.getRequestHandler();

mobxReact.useStaticRendering(true);

// const cache = apicache.middleware;
// apicache.options({
//   debug: true,
// });

// const ssrCache = new LRUCache({
//   max: 1000, // cache item count
//   // maxAge: 1000 * 60 * 60, // 1hour
//   maxAge: 1000 * 10, // 30 ses
// });

app.prepare().then(() => {
  const server = express();
  server.use(helmet());
  server.use(cookieParser());
  server.use(responseTime());
  server.use(express.static('static'));
  server.use(nextI18NextMiddleware(i18n));

  server.get('/_next/*', (req, res) => {
    /* serving _next static content using next.js handler */
    handle(req, res);
  });

  // server.get('/', cache('1 minutes'), (req, res) => app.render(req, res, '/views/home', req.query));

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

const getCacheKey = (req: Request) => `${req.url}`;

// async function renderAndCache(req: Request, res: Response, pagePath: string, queryParams: any) {
//   const key = getCacheKey(req);

//   // If we have a page in the cache, let's serve it
//   if (ssrCache.has(key)) {
//     res.setHeader('x-cache', 'HIT');
//     res.send(ssrCache.get(key));
//     return;
//   }

//   try {
//     // If not let's render the page into HTML
//     const html = await app.renderToHTML(req, res, pagePath, queryParams);

//     // Something is wrong with the request, let's skip the cache
//     if (res.statusCode !== 200) {
//       res.send(html);
//       return;
//     }

//     // Let's cache this page
//     ssrCache.set(key, html);

//     res.setHeader('x-cache', 'MISS');
//     res.send(html);
//   } catch (err) {
//     app.renderError(err, req, res, pagePath, queryParams);
//   }
// }
