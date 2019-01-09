import { buildSchema } from 'type-graphql';

import { PictureResolver } from './Picture/resolver';
import { UserResolver } from './User/resolver';

export default async function () {
  return await buildSchema({
    resolvers: [PictureResolver, UserResolver],
    authChecker: async ({ context }: any, roles: any) => {
      try {
        const oauth = await import('../oauth');
        await oauth.default.authenticate(context.req, context.res, roles);
        return true;
      } catch (error) {
        return false;
      }
    },
  });
}
