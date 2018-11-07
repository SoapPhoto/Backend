import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import { createExpressServer, useContainer as useContainerForRouting } from 'routing-controllers';
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
  const app = createExpressServer({
    routePrefix: '/api',
    controllers: [`${__dirname}/controllers/*.ts`],
    middlewares: [`${__dirname}/middlewares/*.ts`],
  });
  const server = new ApolloServer({
    schema: await graphql(),
    tracing: true,
    cacheControl: true,
  });
  server.applyMiddleware({ app });
  app.listen(process.env.PORT || 3000);
  console.log(`\n 🐱 server is running on port ${process.env.PORT || 3000}.\n`);
})();
