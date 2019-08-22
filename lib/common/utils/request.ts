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

instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.status >= 400) {
      if (!server) {
        let message;
        if (response.data && response.data.message) {
          message = store.i18nStore.__(response.data.message);
        }
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
