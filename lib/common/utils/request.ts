import axios, { AxiosResponse } from 'axios';

import { store } from '@lib/stores/init';
import { server } from '.';

let isRefreshing = false;
// 待请求队列
let requests: any[] = [];

const instance = axios.create({
  withCredentials: true,
  baseURL: `${server ? 'http://127.0.0.1:3001' : process.env.API_URL}`,
  validateStatus(status: number) {
    return status < 500 && status !== 404;
  },
});

// 请求前预先判断token是否失效
// instance.interceptors.request.use(async (config) => {
//   if (server) {
//     return config;
//   }
//   const { refreshToken, isAccessTokenOk } = store.accountStore;
//   if (!isAccessTokenOk()) {
//     await refreshToken();
//     return config;
//   }
//   return config;
// });

instance.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    const { refreshToken, isRefreshTokenOk } = store.accountStore;
    const { config } = response;
    if (response.status >= 400) {
      if (!server) {
        // const message = t(response.data.message);
        switch (response.status) {
          case 401:
            if (isRefreshTokenOk && response.data.message === 'Unauthorized') {
              if (!isRefreshing) {
                isRefreshing = true;
                try {
                  await refreshToken();
                  Promise.all(requests.map(r => r()));
                  requests = [];
                  return instance(config);
                } catch (err) {
                  console.error('refreshToken error =>', err);
                }
              } else {
                requests.push(() => instance(config));
              }
            }
            // if (message) Toast.error(message);
            break;
          case 400:
            // if (message) Toast.error(message);
            break;
          default:
            break;
        }
      }
      return Promise.reject(response.data);
    }
    return Promise.resolve(response);
  },
  (error: any) => Promise.reject(error),
);

export const request = instance;
