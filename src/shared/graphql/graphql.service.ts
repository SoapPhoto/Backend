import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import * as OAuth2Server from 'oauth2-server';

import { OauthServerService } from '@server/modules/oauth/oauth-server/oauth-server.service';
import { validator } from '@common/validator';
import { pubSub } from '@server/common/pubSub';
import { formatValidatorClass } from '@server/common/validator/error';
import { Logger } from '../logging/logging.service';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  constructor(
    private readonly oauthServerService: OauthServerService,
  ) { }

  public async createGqlOptions(): Promise<GqlModuleOptions> {
    return {
      cors: {
        origin: process.env.URL,
        credentials: true,
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
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
        const returnError = (message: string, err?: any) => ({
          ...error,
          message,
          error: err,
        });
        // console.log(error.extensions.exception);
        if (validator.isString(error.message)) {
          Logger.error(
            error.message,
            error.stack ? error.stack.split('\n').toString() : '',
            `graphql-${error.path?.toString()}`,
          );
          return returnError(error.message);
        }
        const { message } = error as any;
        if (message.statusCode === 400) {
          Logger.warn(
            'Validation Error',
            // error.stack,
            `graphql-${error.path?.toString()}`,
          );
          return returnError('Validation Error', formatValidatorClass(message.message));
        }
        return error;
      },
    };
  }
}
