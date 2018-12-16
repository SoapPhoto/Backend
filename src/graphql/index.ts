import { buildSchema } from 'type-graphql';

import { PictureResolver } from './Picture/resolver';
import { UserResolver } from './User/resolver';

export default async function () {
  return await buildSchema({
    resolvers: [PictureResolver, UserResolver],
  });
}
