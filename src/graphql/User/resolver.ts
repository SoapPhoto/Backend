import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { User } from '@entities/User';
import { UserService } from '@services/user';

@Service()
@Resolver(of => User)
export class UserResolver {
  @Inject()
  public userService: UserService;

  @Query(returns => User)
  public async viewer(@Ctx() context: any) {
    try {
      const oauth = await import('../../oauth');
      await oauth.default.authenticate(context.req, context.res, ['user', 'admin']);
      return context.req.auth.user;
    } catch (err) {
      throw err;
    }
  }
}
