import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
// import * as bodyParser from 'body-parser';
import * as express from 'express';
import { useContainer as useContainerForRouting, useExpressServer } from 'routing-controllers';
import { useContainer as useContainerForGql } from 'type-graphql';
import { Container } from 'typedi';
import { createConnection, useContainer as useContainerForOrm } from 'typeorm';

import config from './config';
import graphql from './graphql';

// init
useContainerForOrm(Container);
useContainerForRouting(Container);
useContainerForGql(Container);

(async () => {
  await createConnection(config.database);
  const app = express();
  useExpressServer(app, {
    routePrefix: '/api',
    controllers: [`${__dirname}/controllers/*.ts`],
    middlewares: [`${__dirname}/middlewares/*.ts`],
    defaultErrorHandler: false,
  });
  useExpressServer(app, {
    routePrefix: '/oauth',
    controllers: [`${__dirname}/oauth/controllers/*.ts`],
    defaultErrorHandler: false,
  });
  const server = new ApolloServer({
    schema: await graphql(),
    tracing: true,
    cacheControl: true,
  });
  server.applyMiddleware({ app });
  // app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: false }));
  app.listen(process.env.PORT || 3000);
  console.log(`\n 🐱 server is running on port ${process.env.PORT || 3000}.\n`);
})();
