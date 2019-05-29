declare module 'oauth2-server';
declare module 'path-to-regexp';

declare module 'styled-media-query'

declare namespace Express {
  export interface Request {
    user: import('@server/user/user.entity').UserEntity | null
  }
}
