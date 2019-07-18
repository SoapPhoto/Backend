import axios from 'axios';
// import { setupCache } from 'axios-cache-adapter';

// const cache = setupCache({
//   maxAge: 15 * 60 * 1000,
// });
const instance = axios.create({
  // adapter: cache.adapter,
  withCredentials: true,
  baseURL: `http://localhost.com:${process.env.PORT}`,
  validateStatus (status: number) {
    return status < 500 && status !== 404;
  },
  headers: {
    Accept: 'application/json',
  },
});

instance.interceptors.response.use(
  (response: any) => {
    if (response.status >= 400) {
      return Promise.reject(response);
    }
    return Promise.resolve(response);

  },
  (error: any) =>
    Promise.reject(error),
);

export const request = instance;
