import { request } from '@lib/common/utils/request';
import { OauthType } from '@common/enum/router';

export const oauth = (params: URLSearchParams) => (
  request.post('oauth/token', params, {
    headers: {
      Authorization: `Basic ${process.env.BASIC_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
);

export const oauthToken = (type: OauthType, params: URLSearchParams) => (
  request.post(`oauth/${type}/token`, params, {
    headers: {
      Authorization: `Basic ${process.env.BASIC_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
);
