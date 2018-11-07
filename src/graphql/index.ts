import { buildSchema } from 'type-graphql';

import { PictureResolver } from './Picture/resolver';

export default async function () {
  return await buildSchema({
    resolvers: [PictureResolver],
  });
}
