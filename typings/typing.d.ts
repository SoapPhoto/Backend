declare module 'oauth2-server';

declare module 'path-to-regexp';

declare module 'styled-media-query'

declare module 'react-simple-img';

declare module 'react-keydown';

declare module 'zooming';

declare module 'socks-proxy-agent';

declare module 'rate-limit-redis';

declare module 'cache-manager-redis-store';

declare module 'socks5-https-client/lib/Agent';

declare module '*.json' {
  const value: any;
  export default value;
}

declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  export interface Request {
    user: import('@server/modules/user/user.entity').UserEntity | null;
  }
}
