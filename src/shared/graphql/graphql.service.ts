import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';
import * as OAuth2Server from 'oauth2-server';

import { OauthServerService } from '@server/modules/oauth/oauth-server/oauth-server.service';
import { Logger } from '../logging/logging.service';

const pubSub = new PubSub();

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  constructor(
    private readonly oauthServerService: OauthServerService,
  ) {}

  public async createGqlOptions(): Promise<GqlModuleOptions> {
    return {
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
        requireResolversForResolveType: false,
      },
      typePaths: ['./comment/graphql/*.graphql', './**/*.graphql'],
      installSubscriptionHandlers: true,
      subscriptions: {
        onConnect: async (connectionParams, _webSocket, context: any) => {
          const request = new OAuth2Server.Request({
            method: 'get',
            query: {},
            headers: {
              ...connectionParams,
            },
          });
          const response = new OAuth2Server.Response(context.res);
          try {
            const token = await this.oauthServerService.server.authenticate(request, response);
            context.user = token;
            return {
              user: token.user,
            };
          } catch (err) {
            return {
              user: null,
            };
          }
        },
      },
      formatError: (error: GraphQLError) => {
        Logger.error(
          JSON.stringify({
            message: error.message,
            location: error.locations,
            stack: error.stack ? error.stack.split('\n') : [],
            path: error.path,
          }),
        );
        return error;
      },
    };
  }
}
