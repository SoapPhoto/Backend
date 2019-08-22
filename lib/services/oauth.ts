import { request } from '@lib/common/utils/request';


export const oauthToken = (params: URLSearchParams) => (
  request.post('oauth/token', params, {
    headers: {
      Authorization: `Basic ${process.env.BASIC_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
);
