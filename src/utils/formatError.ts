import { AuthenticationError } from 'apollo-server';

import { OAuthError } from 'src/oauth/utils/error';
import { logger } from './logger';

export function formatError(error: any) {
  logger.fatal(error);
  if (error instanceof OAuthError) {
    return new AuthenticationError(error.message);
  }
}
