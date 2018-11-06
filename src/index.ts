import 'reflect-metadata';
import { createExpressServer, useContainer as useContainerForRouting } from 'routing-controllers';
import { Container } from 'typedi';
import { createConnection, useContainer as useContainerForOrm } from 'typeorm';

import config from './config';

// init
useContainerForOrm(Container);
useContainerForRouting(Container);

(async () => {
  await createConnection(config.database);
  const app = createExpressServer({
    routePrefix: '/api',
    controllers: [`${__dirname}/controllers/*.ts`],
    middlewares: [`${__dirname}/middlewares/*.ts`],
  });
  app.listen(process.env.PORT || 3000);
  console.log(` 🐱 server is running on port ${process.env.PORT || 3000}.`);
})();
