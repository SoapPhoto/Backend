/* eslint-disable import/first */
require('dotenv').config();

const next = require('next');
const express = require('express');
const mobxReact = require('mobx-react');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const LRUCache = require('lru-cache');
const responseTime = require('response-time');
const proxy = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
// const dev = false;

const app = next({ dev, quiet: false });
const handle = app.getRequestHandler();

mobxReact.useStaticRendering(true);

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

  server.get('/_next/*', (req, res) => {
    /* serving _next static content using next.js handler */
    handle(req, res);
  });

  const routeObject = {
    '/': 'views/home',
    '/login': 'views/auth/login',
    '/validatoremail': 'views/auth/validatoremail',
    '/upload': 'views/upload',
    '/picture/:id([0-9]+)': 'views/picture',
    // [`/setting/:type()`]: 'views/setting',
    // [`/@:username/:type()?`]: 'views/user',
    '/tag/:name': 'views/tag',
    '/collection/:id': 'views/collection',
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const key in routeObject) {
    if (key) {
      server.get(key, (req, res) => renderAndCache(req, res, `/${routeObject[key]}`, req.query));
    }
  }
  // server.get('/', (req, res) => handle(req, res, '/views/home', req.query));

  if (dev) {
    server.use(
      '/api',
      proxy({ target: 'http://localhost.com:3001' }),
    );
    server.use(
      '/oauth',
      proxy({ target: 'http://localhost.com:3001' }),
    );
    server.use(
      '/graphql',
      proxy({ target: 'http://localhost.com:3001' }),
    );
  }

  server.get('*', (req, res) => handle(req, res));

  server.listen(process.env.PAGE_PORT, () => {
    console.log(`> Ready on http://localhost:${process.env.PAGE_PORT}`);
  });
});

const getCacheKey = req => `${req.url}`;

async function renderAndCache(req, res, pagePath, queryParams) {
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
