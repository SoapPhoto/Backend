import Toast from '@lib/components/Toast';
import { store } from '@lib/stores/init';
import axios, { AxiosResponse } from 'axios';
import { server } from '.';
// import { setupCache } from 'axios-cache-adapter';

// const cache = setupCache({
//   maxAge: 15 * 60 * 1000,
// });
const instance = axios.create({
  withCredentials: true,
  baseURL: `${process.env.URL}`,
  validateStatus(status: number) {
    return status < 500 && status !== 404;
  },
});

// 请求前预先判断token是否失效
instance.interceptors.request.use(config => new Promise((resolve, rejects) => {
  if (server) {
    return resolve(config);
  }
  const { refreshToken, isTokenOk } = store.accountStore;
  if (!isTokenOk()) {
    refreshToken((err) => {
      if (err) {
        return rejects(err);
      }
      return resolve(config);
    });
  }
  return resolve(config);
}));

instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.status >= 400) {
      if (!server) {
        let message;
        switch (response.status) {
          case 401:
            if (message) Toast.error(message);
            break;
          case 400:
            if (message) Toast.error(message);
            break;
          default:
            break;
        }
      }
      return Promise.reject(response);
    }
    return Promise.resolve(response);
  },
  (error: any) => Promise.reject(error),
);

export const request = instance;
