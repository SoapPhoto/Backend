import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import * as OAuth2Server from 'oauth2-server';
import { isString } from 'class-validator';

import { OauthServerService } from '@server/modules/oauth/oauth-server/oauth-server.service';
import { pubSub } from '@server/common/pubSub';
import { formatValidatorClass } from '@server/common/validator/error';
import { RedisManager } from '@liaoliaots/nestjs-redis';
import { async } from 'rxjs';
import {
  SUBSCRIPTIONS_ONLINE_USER,
  SUBSCRIPTIONS_TOTAL,
} from '@server/common/constants/subscriptions';
import { Logger } from '../logging/logging.service';
import { ApolloDriverConfig } from '@nestjs/apollo';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  constructor(
    private readonly oauthServerService: OauthServerService,
    private readonly redisManager: RedisManager
  ) {}

  public async createGqlOptions(): Promise<ApolloDriverConfig> {
    // 服务器中断就要清空掉redis
    const client = this.redisManager.getClient();
    const data = await client.del(
      SUBSCRIPTIONS_ONLINE_USER,
      SUBSCRIPTIONS_TOTAL
    );
    return {
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
      playground: true,
      cors: {
        origin: '*',
        credentials: true,
      },
      context: async ({ req, res, connection }) => {
        if (connection) {
          return {
            req: connection.context,
            res,
            pubSub,
          };
        }
        return {
          req,
          res,
          pubSub,
          user: req.user,
          headers: req.headers,
          cookies: req.cookies,
        };
      },
      resolverValidationOptions: {
        requireResolversForResolveType: 'ignore',
      },
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: async (
            connectionParams: any,
            _webSocket: any,
            context: any
          ) => {
            const request = new OAuth2Server.Request({
              method: 'get',
              query: {},
              headers: {
                ...connectionParams,
              },
            });
            const redisClient = this.redisManager.getClient();
            // 连接数
            redisClient.incr(SUBSCRIPTIONS_TOTAL);
            // 未登录的用户们
            if (!connectionParams?.Authorization) {
              return {};
            }
            const response = new OAuth2Server.Response(context.res);
            const token = await this.oauthServerService.server.authenticate(
              request,
              response
            );
            context.user = token;
            // 存一下登录用户id
            redisClient.sadd(
              SUBSCRIPTIONS_ONLINE_USER,
              `userId:${context.user.user.id.toString()}`
            );
            pubSub.publish('userOnlineStatus', {
              userOnlineStatus: { online: true },
              user: context.user.user,
            });
            return {
              user: token.user,
            };
          },
          onDisconnect: async (_: any, context: any) => {
            const redisClient = this.redisManager.getClient();
            redisClient.decr(SUBSCRIPTIONS_TOTAL);
            if (context.user) {
              pubSub.publish('userOnlineStatus', {
                userOnlineStatus: { online: false },
                user: context.user.user,
              });
              redisClient.srem(
                SUBSCRIPTIONS_ONLINE_USER,
                `userId:${context.user.user.id.toString()}`
              );
            }
          },
        },
        // 'graphql-ws': {
        //   onConnect: async (context: Context<any>) => {
        //     const { connectionParams } = context;
        //     const request = new OAuth2Server.Request({
        //       method: 'get',
        //       query: {},
        //       headers: {
        //         ...connectionParams,
        //       },
        //     });
        //     console.log(context.extra);
        //     const response = new OAuth2Server.Response(context.res);
        //     const token = await this.oauthServerService.server.authenticate(request, response);
        //     context.user = token;
        //     return {
        //       user: token.user,
        //     };
        //   },
        // },
      },
      formatError: (error: GraphQLError) => {
        const returnError = (message: string, err?: any) => ({
          ...error,
          message,
          error: err,
        });
        // console.log(error.extensions.exception);
        if (isString(error.message)) {
          Logger.error(
            error.message,
            error.stack ? error.stack.toString() : '',
            `graphql-${error.path?.toString()}`
          );
          return returnError(error.message);
        }
        const { message } = error as any;
        if (message.statusCode === 400) {
          Logger.warn(
            'Validation Error',
            // error.stack,
            `graphql-${error.path?.toString()}`
          );
          return returnError(
            'Validation Error',
            formatValidatorClass(message.message)
          );
        }
        return error;
      },
    };
  }
}
