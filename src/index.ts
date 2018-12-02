import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
// import * as bodyParser from 'body-parser';
import * as express from 'express';
import { useContainer as useContainerForRouting, useExpressServer } from 'routing-controllers';
import { useContainer as useContainerForGql } from 'type-graphql';
import { Container } from 'typedi';
import { createConnection, useContainer as useContainerForOrm } from 'typeorm';

import authorizationChecker from '@utils/authorizationChecker';
import config from './config';
import graphql from './graphql';
import { handleError } from './middlewares/error';

// init
useContainerForOrm(Container);
useContainerForRouting(Container);
useContainerForGql(Container);

(async () => {
  await createConnection(config.database);
  const app = express();
  useExpressServer(app, {
    authorizationChecker,
    routePrefix: '/api',
    controllers: [`${__dirname}/controllers/*.ts`],
    defaultErrorHandler: false,
  });
  useExpressServer(app, {
    authorizationChecker,
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
  app.use(handleError);
  // app.use(bodyParser.urlencoded({ extended: false }));
  app.listen(process.env.PORT || 3000);
  console.log(`\n 🐱 server is running on port ${process.env.PORT || 3000}.\n`);
})();
